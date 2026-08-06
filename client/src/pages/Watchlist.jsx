import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as watchlistService from '../services/watchlistService';
import * as stockService from '../services/stockService';
import StockCard from '../components/StockCard';
import Skeleton from '../components/Skeleton';
import { useSocket } from '../hooks/useSocket';
import { useNotification } from '../hooks/useNotification';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingPopular, setIsAddingPopular] = useState(false);
  const { liveStockUpdates } = useSocket();
  const { addToast } = useNotification();

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await watchlistService.getWatchlist();
      const rawList = res.data?.stockIds || res.data || [];
      const stockList = (Array.isArray(rawList) ? rawList : []).filter(
        (s) => s && (s._id || s.symbol)
      );
      setWatchlist(stockList);
    } catch (err) {
      addToast('danger', 'Error', 'Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (stockId, symbol) => {
    if (!stockId) return;
    try {
      await watchlistService.removeFromWatchlist(stockId);
      addToast('info', 'Removed', `Removed ${symbol || 'stock'} from watchlist`);
      fetchWatchlist();
    } catch (err) {
      addToast('danger', 'Error', 'Could not remove stock');
    }
  };

  const handleAddPopularStocks = async () => {
    setIsAddingPopular(true);
    try {
      const res = await stockService.getStocks({ limit: 4 });
      const topStocks = res.data?.stocks || [];
      for (const s of topStocks) {
        if (s._id) {
          await watchlistService.addToWatchlist(s._id);
        }
      }
      addToast('success', 'Watchlist Updated', 'Added top blue-chip stocks to your watchlist!');
      fetchWatchlist();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to add popular stocks');
    } finally {
      setIsAddingPopular(false);
    }
  };

  return (
    <div className="container">
      <div className="glass-card p-4 mb-4">
        <h2 className="fw-bold text-light mb-1">
          <i className="bi bi-star-fill text-warning me-2"></i> Watchlist
        </h2>
        <p className="text-muted mb-0">Monitor your favorite stocks with real-time price feeds.</p>
      </div>

      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <Skeleton height="220px" />
            </div>
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-star fs-1 text-warning d-block mb-3"></i>
          <h4 className="text-light fw-bold mb-2">Your Watchlist is Empty</h4>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '480px' }}>
            You haven't bookmarked any stocks yet. Click below to instantly add top blue-chip stocks or explore the market dashboard!
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              className="btn btn-warning px-4 fw-semibold text-dark"
              onClick={handleAddPopularStocks}
              disabled={isAddingPopular}
            >
              <i className="bi bi-magic me-2"></i>
              {isAddingPopular ? 'Adding Popular Stocks...' : 'Add Top Blue-Chip Stocks'}
            </button>
            <Link to="/dashboard" className="btn btn-outline-light px-4">
              <i className="bi bi-grid-1x2 me-2"></i> Explore Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {watchlist.map((stock, index) => (
            <div key={stock._id || index} className="col-md-6 col-lg-3 position-relative">
              <button
                className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-3 z-3"
                onClick={() => handleRemove(stock._id, stock.symbol)}
                title="Remove from watchlist"
              >
                <i className="bi bi-trash"></i>
              </button>
              <StockCard stock={stock} liveData={liveStockUpdates} onTradeSuccess={fetchWatchlist} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
