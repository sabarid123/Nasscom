import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent } from '../utils/formatters';
import OrderModal from './OrderModal';
import * as watchlistService from '../services/watchlistService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const StockCard = ({ stock, liveData, onTradeSuccess }) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [currentPrice, setCurrentPrice] = useState(stock.currentPrice);
  const [openPrice, setOpenPrice] = useState(stock.openPrice);

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [initialTradeType, setInitialTradeType] = useState('BUY');
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

  const change = currentPrice - openPrice;
  const changePercent = openPrice > 0 ? (change / openPrice) * 100 : 0;
  const isPositive = change >= 0;

  const openOrder = (type) => {
    setInitialTradeType(type);
    setOrderModalOpen(true);
  };

  return (
    <>
      <div className="glass-card p-3 h-100 d-flex flex-column justify-content-between border border-secondary border-opacity-25 hover-shadow">
        <div>
          {/* Header Badge & Watchlist */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-primary bg-opacity-25 text-primary fw-bold d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}
              >
                {stock.symbol.slice(0, 3)}
              </div>
              <div>
                <h6 className="fw-bold mb-0">
                  <Link to={`/stocks/${stock._id}`} className="text-decoration-none text-light hover-primary">
                    {stock.symbol}
                  </Link>
                </h6>
                <small className="text-muted d-block text-truncate" style={{ maxWidth: '130px' }}>
                  {stock.companyName}
                </small>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm p-0 border-0"
              onClick={handleToggleWatchlist}
              title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
              style={{ background: 'transparent' }}
            >
              <i className={`bi bi-bookmark-star${isWatchlisted ? '-fill text-warning' : ' text-muted'}`}></i>
            </button>
          </div>

          {/* Price & Change Badge */}
          <div className="d-flex justify-content-between align-items-end my-3">
            <div>
              <span className="text-muted small d-block">LTP (NSE)</span>
              <h5 className="fw-bold text-light mb-0">{formatCurrency(currentPrice)}</h5>
            </div>
            <div className="text-end">
              <span className={`badge ${isPositive ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'} px-2 py-1`}>
                <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}-short me-1`}></i>
                {formatPercent(changePercent)}
              </span>
            </div>
          </div>

          {/* Day High / Low Bar */}
          <div className="row text-center text-muted py-2 bg-dark bg-opacity-50 rounded g-0 mb-3" style={{ fontSize: '0.78rem' }}>
            <div className="col">
              <span className="d-block text-uppercase">High</span>
              <strong className="text-light">{formatCurrency(stock.high || currentPrice)}</strong>
            </div>
            <div className="col border-start border-secondary border-opacity-25">
              <span className="d-block text-uppercase">Low</span>
              <strong className="text-light">{formatCurrency(stock.low || currentPrice)}</strong>
            </div>
          </div>
        </div>

        {/* Quick Buy / Sell Buttons */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-success fw-bold flex-grow-1"
            onClick={() => openOrder('BUY')}
          >
            BUY
          </button>
          <button
            className="btn btn-sm btn-danger fw-bold flex-grow-1"
            onClick={() => openOrder('SELL')}
          >
            SELL
          </button>
        </div>
      </div>

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        stock={{ ...stock, currentPrice, openPrice }}
        initialType={initialTradeType}
        onSuccess={onTradeSuccess}
      />
    </>
  );
};

export default StockCard;
