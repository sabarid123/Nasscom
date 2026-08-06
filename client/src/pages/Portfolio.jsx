import React, { useState, useEffect } from 'react';
import * as portfolioService from '../services/portfolioService';
import * as tradeService from '../services/tradeService';
import { PortfolioChart, PortfolioLineChart } from '../components/PortfolioChart';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { liveStockUpdates } = useSocket();
  const { updateUserProfile } = useAuth();
  const { addToast } = useNotification();

  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const res = await portfolioService.getPortfolio();
      setPortfolio(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);



  const openSellModal = (item) => {
    setSelectedHolding(item);
    setSellQuantity(1);
    setSellModalOpen(true);
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHolding) return;
    setIsSubmitting(true);
    try {
      const res = await tradeService.sellStock(selectedHolding.stockId, Number(sellQuantity));
      addToast('success', 'Sell Order Executed', `Sold ${sellQuantity} shares of ${selectedHolding.symbol}`);
      updateUserProfile({ walletBalance: res.data.walletBalance });
      setSellModalOpen(false);
      fetchPortfolio();
    } catch (err) {
      addToast('danger', 'Sell Order Failed', err.message || 'Could not complete order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <Skeleton height="120px" width="100%" className="mb-4" />
        <Skeleton height="300px" width="100%" />
      </div>
    );
  }

  const {
    walletBalance,
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercent,
    todayChange,
    totalNetWorth,
    holdings = [],
  } = portfolio || {};

  const isProfit = totalProfitLoss >= 0;

  return (
    <div className="container">
      {/* Portfolio Header Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="glass-card p-4 h-100">
            <span className="text-muted d-block small mb-1">Total Net Worth</span>
            <h3 className="fw-bold text-light mb-0">{formatCurrency(totalNetWorth)}</h3>
            <small className="text-muted">Cash + Investments</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="glass-card p-4 h-100">
            <span className="text-muted d-block small mb-1">Current Value</span>
            <h3 className="fw-bold text-primary mb-0">{formatCurrency(totalCurrentValue)}</h3>
            <small className="text-muted">Invested: {formatCurrency(totalInvested)}</small>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="glass-card p-4 h-100">
            <span className="text-muted d-block small mb-1">Total Profit / Loss</span>
            <h3 className={`fw-bold mb-0 ${isProfit ? 'text-success-custom' : 'text-danger-custom'}`}>
              {formatCurrency(totalProfitLoss)}
            </h3>
            <span className={isProfit ? 'badge-gain' : 'badge-loss'}>
              {formatPercent(totalProfitLossPercent)}
            </span>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="glass-card p-4 h-100">
            <span className="text-muted d-block small mb-1">Available Cash</span>
            <h3 className="fw-bold text-light mb-0">{formatCurrency(walletBalance)}</h3>
            <small className="text-muted">Ready to trade</small>
          </div>
        </div>
      </div>

      {/* Portfolio Valuation Trend Graph */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-light mb-0">
              <i className="bi bi-graph-up-arrow me-2 text-success"></i> Portfolio Growth Trend
            </h5>
            <small className="text-muted">7-Day Valuation Trajectory</small>
          </div>
          <span className={isProfit ? 'badge-gain' : 'badge-loss'}>
            {isProfit ? 'GROWING' : 'DECLINING'}
          </span>
        </div>
        <PortfolioLineChart totalCurrentValue={totalCurrentValue} totalInvested={totalInvested} />
      </div>

      <div className="row g-4 mb-4">
        {/* Holdings Table */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold text-light mb-3">Current Stock Holdings</h5>
            {holdings.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-wallet2 fs-1 d-block mb-2"></i>
                You do not currently hold any stocks. Start buying from the Dashboard!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                  <thead>
                    <tr className="text-muted small">
                      <th>STOCK</th>
                      <th className="text-end">QTY</th>
                      <th className="text-end">AVG PRICE</th>
                      <th className="text-end">LTP</th>
                      <th className="text-end">CURRENT VAL</th>
                      <th className="text-end">P&L</th>
                      <th className="text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((item) => {
                      const itemProfit = item.profitLoss >= 0;
                      return (
                        <tr key={item.stockId}>
                          <td>
                            <strong className="d-block text-light">{item.symbol}</strong>
                            <small className="text-muted">{item.companyName}</small>
                          </td>
                          <td className="text-end fw-semibold">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.averagePrice)}</td>
                          <td className="text-end fw-bold">{formatCurrency(item.currentPrice)}</td>
                          <td className="text-end">{formatCurrency(item.currentValue)}</td>
                          <td className="text-end">
                            <span className={itemProfit ? 'text-success-custom fw-bold' : 'text-danger-custom fw-bold'}>
                              {formatCurrency(item.profitLoss)}
                            </span>
                            <small className={`d-block ${itemProfit ? 'text-success-custom' : 'text-danger-custom'}`}>
                              ({formatPercent(item.profitLossPercent)})
                            </small>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-danger-gradient"
                              onClick={() => openSellModal(item)}
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Asset Allocation Doughnut Chart */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold text-light mb-3">Asset Allocation</h5>
            <PortfolioChart holdings={holdings} />
          </div>
        </div>
      </div>

      {/* Sell Modal from Portfolio */}
      {selectedHolding && (
        <Modal isOpen={sellModalOpen} onClose={() => setSellModalOpen(false)} title={`Sell ${selectedHolding.symbol}`}>
          <form onSubmit={handleSellSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted">Company</label>
              <div className="fw-bold">{selectedHolding.companyName} ({selectedHolding.symbol})</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted">Current Market Price</label>
              <div className="fw-bold text-danger-custom">{formatCurrency(selectedHolding.currentPrice)}</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted">Shares Available to Sell</label>
              <div className="fw-semibold text-light">{selectedHolding.quantity} shares</div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted">Quantity to Sell</label>
              <input
                type="number"
                min="1"
                max={selectedHolding.quantity}
                className="form-control glass-input"
                value={sellQuantity}
                onChange={(e) => setSellQuantity(e.target.value)}
                required
              />
            </div>
            <div className="p-3 mb-3 rounded bg-secondary bg-opacity-25 border border-secondary">
              <div className="d-flex justify-content-between mb-1">
                <span>Estimated Proceeds:</span>
                <strong className="text-light">
                  {formatCurrency(selectedHolding.currentPrice * Number(sellQuantity))}
                </strong>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setSellModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger-gradient" disabled={isSubmitting}>
                {isSubmitting ? 'Executing...' : 'Confirm Sell'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Portfolio;
