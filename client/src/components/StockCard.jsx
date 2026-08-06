import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent } from '../utils/formatters';
import Modal from './Modal';
import * as tradeService from '../services/tradeService';
import * as portfolioService from '../services/portfolioService';
import * as watchlistService from '../services/watchlistService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const StockCard = ({ stock, liveData, onTradeSuccess }) => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useNotification();
  const [currentPrice, setCurrentPrice] = useState(stock.currentPrice);
  const [openPrice, setOpenPrice] = useState(stock.openPrice);

  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownedShares, setOwnedShares] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    if (user && stock._id) {
      watchlistService.getWatchlist().then((res) => {
        const rawList = res.data?.stockIds || res.data || [];
        const found = (Array.isArray(rawList) ? rawList : []).some(
          (s) => (s._id ? s._id.toString() === stock._id.toString() : s.toString() === stock._id.toString())
        );
        setIsWatchlisted(found);
      }).catch(() => {});
    }
  }, [user, stock._id]);

  const handleToggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return addToast('warning', 'Login Required', 'Please login to manage watchlist');
    try {
      if (isWatchlisted) {
        await watchlistService.removeFromWatchlist(stock._id);
        setIsWatchlisted(false);
        addToast('info', 'Watchlist', `Removed ${stock.symbol} from watchlist.`);
      } else {
        await watchlistService.addToWatchlist(stock._id);
        setIsWatchlisted(true);
        addToast('success', 'Watchlist', `Added ${stock.symbol} to watchlist.`);
      }
    } catch (err) {
      addToast('danger', 'Error', 'Could not update watchlist.');
    }
  };

  useEffect(() => {
    if (liveData && liveData[stock.symbol]) {
      setCurrentPrice(liveData[stock.symbol].currentPrice);
      if (liveData[stock.symbol].openPrice) {
        setOpenPrice(liveData[stock.symbol].openPrice);
      }
    }
  }, [liveData, stock.symbol]);

  useEffect(() => {
    if (sellModalOpen) {
      portfolioService
        .getPortfolio()
        .then((res) => {
          const holdings = res.data?.holdings || [];
          const match = holdings.find(
            (h) =>
              (h.stockId && (h.stockId._id ? h.stockId._id === stock._id : h.stockId === stock._id)) ||
              h.symbol === stock.symbol
          );
          setOwnedShares(match ? match.quantity : 0);
        })
        .catch(() => setOwnedShares(0));
    }
  }, [sellModalOpen, stock._id, stock.symbol]);

  const change = currentPrice - openPrice;
  const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;
  const isPositive = change >= 0;

  const handleBuy = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await tradeService.buyStock(stock._id, Number(tradeQuantity));
      addToast('success', 'Purchase Successful', `Bought ${tradeQuantity} shares of ${stock.symbol}`);
      updateUserProfile({ walletBalance: res.data.walletBalance });
      setBuyModalOpen(false);
      if (onTradeSuccess) onTradeSuccess();
    } catch (err) {
      addToast('danger', 'Purchase Failed', err.message || 'Could not complete order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    if (ownedShares <= 0) {
      addToast('warning', 'No Holdings', `You do not own any shares of ${stock.symbol} to sell.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await tradeService.sellStock(stock._id, Number(tradeQuantity));
      addToast('success', 'Sell Order Executed', `Sold ${tradeQuantity} shares of ${stock.symbol}`);
      updateUserProfile({ walletBalance: res.data.walletBalance });
      setSellModalOpen(false);
      if (onTradeSuccess) onTradeSuccess();
    } catch (err) {
      addToast('danger', 'Sell Order Failed', err.message || 'Could not complete order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span className="badge bg-secondary mb-1">{stock.sector}</span>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold mb-0">
                  <Link to={`/stocks/${stock._id}`} className="text-decoration-none text-light">
                    {stock.symbol}
                  </Link>
                </h5>
                <button
                  type="button"
                  className="btn btn-sm p-0 border-0 text-decoration-none"
                  onClick={handleToggleWatchlist}
                  title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
                  style={{ background: 'transparent' }}
                >
                  <i className={`bi bi-star${isWatchlisted ? '-fill text-warning' : ' text-muted'}`}></i>
                </button>
              </div>
              <small className="text-muted d-block text-truncate" style={{ maxWidth: '180px' }}>
                {stock.companyName}
              </small>
            </div>
            <div className="text-end">
              <h5 className="fw-bold mb-0">{formatCurrency(currentPrice)}</h5>
              <span className={isPositive ? 'badge-gain' : 'badge-loss'}>
                <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}-short`}></i>
                {formatPercent(changePercent)}
              </span>
            </div>
          </div>

          <div className="row text-center text-muted my-3 py-2 border-top border-bottom border-secondary g-0" style={{ fontSize: '0.85rem' }}>
            <div className="col">
              <span className="d-block text-uppercase">High</span>
              <strong className="text-light">{formatCurrency(stock.high || currentPrice)}</strong>
            </div>
            <div className="col">
              <span className="d-block text-uppercase">Low</span>
              <strong className="text-light">{formatCurrency(stock.low || currentPrice)}</strong>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          <button
            className="btn btn-sm btn-success-gradient flex-grow-1"
            onClick={() => setBuyModalOpen(true)}
          >
            Buy
          </button>
          <button
            className="btn btn-sm btn-danger-gradient flex-grow-1"
            onClick={() => setSellModalOpen(true)}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Buy Stock Modal */}
      <Modal isOpen={buyModalOpen} onClose={() => setBuyModalOpen(false)} title={`Buy ${stock.symbol}`}>
        <form onSubmit={handleBuy}>
          <div className="mb-3">
            <label className="form-label text-muted">Company</label>
            <div className="fw-bold">{stock.companyName} ({stock.symbol})</div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Current Price</label>
            <div className="fw-bold text-success-custom">{formatCurrency(currentPrice)}</div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Quantity</label>
            <input
              type="number"
              min="1"
              className="form-control glass-input"
              value={tradeQuantity}
              onChange={(e) => setTradeQuantity(e.target.value)}
              required
            />
          </div>
          <div className="p-3 mb-3 rounded bg-secondary bg-opacity-25 border border-secondary">
            <div className="d-flex justify-content-between mb-1">
              <span>Total Cost:</span>
              <strong className="text-light">{formatCurrency(currentPrice * Number(tradeQuantity))}</strong>
            </div>
            <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.85rem' }}>
              <span>Available Cash:</span>
              <span>{formatCurrency(user ? user.walletBalance : 0)}</span>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setBuyModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success-gradient" disabled={isSubmitting}>
              {isSubmitting ? 'Executing...' : 'Confirm Buy'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Sell Stock Modal */}
      <Modal isOpen={sellModalOpen} onClose={() => setSellModalOpen(false)} title={`Sell ${stock.symbol}`}>
        <form onSubmit={handleSell}>
          <div className="mb-3">
            <label className="form-label text-muted">Company</label>
            <div className="fw-bold">{stock.companyName} ({stock.symbol})</div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Current Market Price</label>
            <div className="fw-bold text-danger-custom">{formatCurrency(currentPrice)}</div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted">Shares Currently Owned</label>
            <div className={`fw-bold ${ownedShares > 0 ? 'text-success-custom' : 'text-warning'}`}>
              {ownedShares} {ownedShares === 1 ? 'share' : 'shares'}
            </div>
          </div>

          {ownedShares === 0 ? (
            <div className="alert alert-warning py-2 px-3 mb-3 small d-flex align-items-center justify-content-between rounded">
              <div>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                You do not hold any shares of {stock.symbol} yet.
              </div>
              <button
                type="button"
                className="btn btn-sm btn-success ms-2 text-nowrap"
                onClick={() => {
                  setSellModalOpen(false);
                  setBuyModalOpen(true);
                }}
              >
                Buy Instead
              </button>
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label text-muted">Quantity to Sell</label>
              <input
                type="number"
                min="1"
                max={ownedShares}
                className="form-control glass-input"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(e.target.value)}
                required
              />
            </div>
          )}

          <div className="p-3 mb-3 rounded bg-secondary bg-opacity-25 border border-secondary">
            <div className="d-flex justify-content-between mb-1">
              <span>Estimated Proceeds:</span>
              <strong className="text-light">{formatCurrency(currentPrice * Number(tradeQuantity))}</strong>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setSellModalOpen(false)}>
              Cancel
            </button>
            {ownedShares > 0 ? (
              <button type="submit" className="btn btn-danger-gradient" disabled={isSubmitting}>
                {isSubmitting ? 'Executing...' : 'Confirm Sell'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success-gradient"
                onClick={() => {
                  setSellModalOpen(false);
                  setBuyModalOpen(true);
                }}
              >
                Buy {stock.symbol}
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default StockCard;
