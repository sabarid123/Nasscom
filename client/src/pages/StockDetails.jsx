import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as stockService from '../services/stockService';
import * as watchlistService from '../services/watchlistService';
import * as tradeService from '../services/tradeService';
import * as portfolioService from '../services/portfolioService';
import StockChart from '../components/StockChart';
import Skeleton from '../components/Skeleton';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useSocket } from '../hooks/useSocket';

const StockDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useNotification();
  const { liveStockUpdates } = useSocket();

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [ownedShares, setOwnedShares] = useState(0);

  const fetchStock = async () => {
    try {
      const res = await stockService.getStockById(id);
      setStock(res.data);
    } catch (err) {
      addToast('danger', 'Error', 'Failed to load stock details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const res = await watchlistService.getWatchlist();
      if (res.data && res.data.stockIds) {
        const found = res.data.stockIds.some((s) => (s._id ? s._id === id : s === id));
        setIsWatchlisted(found);
      }
    } catch (err) {
      // Ignored
    }
  };

  const fetchOwnedShares = async () => {
    try {
      const res = await portfolioService.getPortfolio();
      const holdings = res.data?.holdings || [];
      const match = holdings.find(
        (h) => (h.stockId && (h.stockId._id ? h.stockId._id === id : h.stockId === id)) || h.symbol === stock?.symbol
      );
      setOwnedShares(match ? match.quantity : 0);
    } catch (err) {
      setOwnedShares(0);
    }
  };

  useEffect(() => {
    fetchStock();
    checkWatchlistStatus();
    fetchOwnedShares();
  }, [id]);

  if (loading || !stock) {
    return (
      <div className="container py-5">
        <Skeleton height="60px" width="300px" className="mb-4" />
        <Skeleton height="350px" width="100%" className="mb-4" />
      </div>
    );
  }

  const liveQuote = liveStockUpdates[stock.symbol];
  const currentPrice = liveQuote ? liveQuote.currentPrice : stock.currentPrice;
  const openPrice = liveQuote ? liveQuote.openPrice || stock.openPrice : stock.openPrice;

  const change = currentPrice - openPrice;
  const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;
  const isPositive = change >= 0;

  const handleToggleWatchlist = async () => {
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
      addToast('danger', 'Error', 'Failed to update watchlist.');
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    if (tradeType === 'SELL' && ownedShares <= 0) {
      addToast('warning', 'No Holdings', `You do not hold any shares of ${stock.symbol} to sell.`);
      return;
    }
    setIsSubmitting(true);
    try {
      if (tradeType === 'BUY') {
        const res = await tradeService.buyStock(stock._id, Number(quantity));
        addToast('success', 'Order Executed', `Bought ${quantity} shares of ${stock.symbol}`);
        updateUserProfile({ walletBalance: res.data.walletBalance });
      } else {
        const res = await tradeService.sellStock(stock._id, Number(quantity));
        addToast('success', 'Order Executed', `Sold ${quantity} shares of ${stock.symbol}`);
        updateUserProfile({ walletBalance: res.data.walletBalance });
      }
      fetchStock();
      fetchOwnedShares();
    } catch (err) {
      addToast('danger', 'Trade Failed', err.message || 'Order execution failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-3">
      {/* Header Info */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-3 mb-1">
              <h2 className="fw-bold text-light mb-0">{stock.symbol}</h2>
              <span className="badge bg-secondary">{stock.sector}</span>
              <button
                className={`btn btn-sm ${isWatchlisted ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={handleToggleWatchlist}
              >
                <i className={`bi bi-star${isWatchlisted ? '-fill' : ''} me-1`}></i>
                {isWatchlisted ? 'Watchlisted' : 'Add Watchlist'}
              </button>
            </div>
            <h5 className="text-muted mb-0">{stock.companyName}</h5>
          </div>

          <div className="text-md-end">
            <h2 className="fw-bold text-light mb-0">{formatCurrency(currentPrice)}</h2>
            <span className={isPositive ? 'badge-gain fs-6' : 'badge-loss fs-6'}>
              <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}-short`}></i>
              {formatPercent(changePercent)} Today
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Interactive Chart */}
        <div className="col-lg-8">
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold text-light mb-3">Live Price Action</h5>
            <StockChart
              historicalData={stock.historicalData}
              symbol={stock.symbol}
              color={isPositive ? '#10b981' : '#ef4444'}
            />
          </div>

          {/* Key Financial Indicators */}
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold text-light mb-3">Market Fundamentals</h5>
            <div className="row g-3 text-center">
              <div className="col-6 col-md-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <span className="text-muted d-block small">Open Price</span>
                  <strong className="text-light">{formatCurrency(openPrice)}</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <span className="text-muted d-block small">Day High</span>
                  <strong className="text-light">{formatCurrency(stock.high)}</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <span className="text-muted d-block small">Day Low</span>
                  <strong className="text-light">{formatCurrency(stock.low)}</strong>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3 bg-secondary bg-opacity-25 rounded border border-secondary">
                  <span className="text-muted d-block small">Market Cap</span>
                  <strong className="text-light">{stock.marketCap}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Market Depth (5 Best Bids / 5 Best Asks) */}
          <div className="glass-card p-4">
            <h5 className="fw-bold text-light mb-3">Market Depth (Order Book)</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="table-responsive">
                  <table className="table table-dark table-sm align-middle text-center mb-0" style={{ fontSize: '0.82rem' }}>
                    <thead>
                      <tr className="text-success border-bottom border-secondary">
                        <th>Bid Qty</th>
                        <th>Bid Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0.05, 0.10, 0.15, 0.20, 0.25].map((offset, i) => (
                        <tr key={i}>
                          <td className="text-muted">{(150 * (i + 1) * 3).toLocaleString('en-IN')}</td>
                          <td className="text-success fw-bold">₹{(currentPrice - offset).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-6">
                <div className="table-responsive">
                  <table className="table table-dark table-sm align-middle text-center mb-0" style={{ fontSize: '0.82rem' }}>
                    <thead>
                      <tr className="text-danger border-bottom border-secondary">
                        <th>Ask Price (₹)</th>
                        <th>Ask Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[0.05, 0.10, 0.15, 0.20, 0.25].map((offset, i) => (
                        <tr key={i}>
                          <td className="text-danger fw-bold">₹{(currentPrice + offset).toFixed(2)}</td>
                          <td className="text-muted">{(120 * (i + 1) * 2.5).toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Execution Sidebar */}
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold text-light mb-3">Order Ticket</h5>

            <div className="btn-group w-100 mb-4" role="group">
              <button
                type="button"
                className={`btn ${tradeType === 'BUY' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setTradeType('BUY')}
              >
                BUY
              </button>
              <button
                type="button"
                className={`btn ${tradeType === 'SELL' ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={() => setTradeType('SELL')}
              >
                SELL
              </button>
            </div>

            <form onSubmit={handleTrade}>
              <div className="mb-3">
                <label className="form-label text-muted">Order Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={tradeType === 'SELL' && ownedShares > 0 ? ownedShares : undefined}
                  className="form-control glass-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              {tradeType === 'SELL' && ownedShares === 0 ? (
                <div className="alert alert-warning py-2 px-3 mb-3 small rounded">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  You do not hold any shares of {stock.symbol} in your portfolio.
                </div>
              ) : null}

              <div className="p-3 mb-4 rounded bg-secondary bg-opacity-25 border border-secondary">
                <div className="d-flex justify-content-between mb-2">
                  <span>Price per Share:</span>
                  <strong className="text-light">{formatCurrency(currentPrice)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Order Value:</span>
                  <strong className="text-primary">{formatCurrency(currentPrice * Number(quantity))}</strong>
                </div>
                <div className="d-flex justify-content-between text-muted small border-top border-secondary pt-2">
                  <span>Shares Owned:</span>
                  <span className={ownedShares > 0 ? 'text-success-custom fw-bold' : 'text-light'}>
                    {ownedShares} shares
                  </span>
                </div>
                <div className="d-flex justify-content-between text-muted small pt-1">
                  <span>Available Balance:</span>
                  <span>{formatCurrency(user ? user.walletBalance : 0)}</span>
                </div>
              </div>

              {tradeType === 'SELL' && ownedShares === 0 ? (
                <button
                  type="button"
                  className="btn btn-success-gradient w-100"
                  onClick={() => setTradeType('BUY')}
                >
                  Switch to BUY {stock.symbol}
                </button>
              ) : (
                <button
                  type="submit"
                  className={`btn w-100 ${tradeType === 'BUY' ? 'btn-success-gradient' : 'btn-danger-gradient'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Processing Trade...'
                    : `Place ${tradeType} Order`}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
