import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { formatCurrency, formatPercent } from '../utils/formatters';
import * as tradeService from '../services/tradeService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const OrderModal = ({ isOpen, onClose, stock, initialType = 'BUY', onSuccess }) => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useNotification();

  const [tradeType, setTradeType] = useState(initialType); // BUY | SELL
  const [productType, setProductType] = useState('CNC'); // CNC (Delivery) | MIS (Intraday)
  const [orderType, setOrderType] = useState('MARKET'); // MARKET | LIMIT
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTradeType(initialType);
    if (stock) {
      setLimitPrice(stock.currentPrice || '');
      setQuantity(1);
    }
  }, [initialType, stock, isOpen]);

  if (!stock) return null;

  const currentPrice = stock.currentPrice || 0;
  const executionPrice = orderType === 'LIMIT' && Number(limitPrice) > 0 ? Number(limitPrice) : currentPrice;
  const requiredAmount = Number((quantity * executionPrice).toFixed(2));
  const availableBalance = user?.walletBalance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) {
      return addToast('warning', 'Invalid Quantity', 'Please enter a valid quantity.');
    }

    if (tradeType === 'BUY' && requiredAmount > availableBalance) {
      return addToast(
        'danger',
        'Insufficient Balance',
        `Required: ${formatCurrency(requiredAmount)}, Available: ${formatCurrency(availableBalance)}`
      );
    }

    setSubmitting(true);
    try {
      let res;
      if (tradeType === 'BUY') {
        res = await tradeService.buyStock(stock._id, quantity);
      } else {
        res = await tradeService.sellStock(stock._id, quantity);
      }

      if (res.data && res.data.walletBalance !== undefined) {
        updateUserProfile({ walletBalance: res.data.walletBalance });
      }

      addToast(
        'success',
        `${tradeType === 'BUY' ? 'Buy' : 'Sell'} Order Executed!`,
        `Successfully ${tradeType === 'BUY' ? 'purchased' : 'sold'} ${quantity} shares of ${stock.symbol} at ${formatCurrency(executionPrice)}`
      );

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      addToast('danger', 'Order Execution Failed', err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isBuy = tradeType === 'BUY';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="order-modal-content">
        {/* Header Title Bar */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-25">
          <div>
            <span className={`badge ${isBuy ? 'bg-success' : 'bg-danger'} text-uppercase me-2`}>
              {tradeType}
            </span>
            <span className="fw-bold text-light fs-5">{stock.symbol}</span>
            <small className="text-muted ms-2 d-none d-sm-inline">{stock.companyName}</small>
          </div>
          <div className="text-end">
            <div className="fw-bold text-light fs-5">{formatCurrency(currentPrice)}</div>
            {stock.openPrice && (
              <small className={stock.currentPrice >= stock.openPrice ? 'text-success' : 'text-danger'}>
                {formatPercent(((stock.currentPrice - stock.openPrice) / stock.openPrice) * 100)}
              </small>
            )}
          </div>
        </div>

        {/* Buy / Sell Toggle Tabs */}
        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn ${isBuy ? 'btn-success fw-bold' : 'btn-outline-secondary text-muted'}`}
            onClick={() => setTradeType('BUY')}
          >
            <i className="bi bi-arrow-down-left-circle me-1"></i> BUY
          </button>
          <button
            type="button"
            className={`btn ${!isBuy ? 'btn-danger fw-bold' : 'btn-outline-secondary text-muted'}`}
            onClick={() => setTradeType('SELL')}
          >
            <i className="bi bi-arrow-up-right-circle me-1"></i> SELL
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Delivery / Intraday Segment */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 ${productType === 'CNC' ? 'btn-primary' : 'btn-outline-secondary text-muted'}`}
                onClick={() => setProductType('CNC')}
              >
                Delivery (CNC)
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className={`btn btn-sm w-100 ${productType === 'MIS' ? 'btn-primary' : 'btn-outline-secondary text-muted'}`}
                onClick={() => setProductType('MIS')}
              >
                Intraday (MIS)
              </button>
            </div>
          </div>

          {/* Market / Limit Order Selector */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label text-muted small mb-1">Order Type</label>
              <select
                className="form-select glass-input form-select-sm text-light"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="MARKET" className="bg-dark">Market Price</option>
                <option value="LIMIT" className="bg-dark">Limit Price</option>
              </select>
            </div>

            <div className="col-6">
              <label className="form-label text-muted small mb-1">
                {orderType === 'LIMIT' ? 'Limit Price (₹)' : 'Executing At'}
              </label>
              <input
                type="number"
                step="0.05"
                disabled={orderType === 'MARKET'}
                className="form-control glass-input form-control-sm text-light"
                value={orderType === 'MARKET' ? currentPrice : limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-3">
            <label className="form-label text-muted small mb-1">Quantity (Shares)</label>
            <div className="input-group input-group-sm">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                className="form-control glass-input text-center text-light fw-bold"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Trade Summary Info Box */}
          <div className="glass-card p-3 mb-3 border border-secondary border-opacity-25 rounded">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted small">Required Funds</span>
              <strong className="text-light">{formatCurrency(requiredAmount)}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted small">Available Balance</span>
              <span className={availableBalance >= requiredAmount ? 'text-success' : 'text-danger fw-bold'}>
                {formatCurrency(availableBalance)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-sm px-4 fw-bold ${isBuy ? 'btn-success' : 'btn-danger'}`}
              disabled={submitting}
            >
              {submitting ? 'Executing...' : `${tradeType} ${quantity} SHARES`}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default OrderModal;
