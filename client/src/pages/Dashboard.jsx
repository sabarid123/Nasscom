import React, { useState, useEffect } from 'react';
import * as stockService from '../services/stockService';
import StockCard from '../components/StockCard';
import Skeleton from '../components/Skeleton';
import { useSocket } from '../hooks/useSocket';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');

  const { liveStockUpdates } = useSocket();

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await stockService.getStocks({
        search,
        sector,
        sortBy,
        sortOrder,
        page,
        limit: 8,
      });
      setStocks(res.data.stocks);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [search, sector, sortBy, sortOrder, page]);

  return (
    <div className="container">
      {/* Top Banner / Ticker Header */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h2 className="fw-bold text-light mb-0">Market Dashboard</h2>
              <span className="badge bg-danger rounded-pill px-3 py-1 d-flex align-items-center gap-1">
                <span className="spinner-grow spinner-grow-sm text-light" style={{ width: '8px', height: '8px' }}></span>
                LIVE TICKS
              </span>
            </div>
            <p className="text-muted mb-0">Explore stocks, analyze metrics, and execute trades instantly.</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text glass-input border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control glass-input border-start-0"
                placeholder="Search symbol or company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select glass-input"
              value={sector}
              onChange={(e) => {
                setSector(e.target.value);
                setPage(1);
              }}
            >
              <option value="" className="bg-dark">All Sectors (40+ Companies)</option>
              <option value="Technology" className="bg-dark">Technology & IT</option>
              <option value="Financial Services" className="bg-dark">Banking & Financial Services</option>
              <option value="Energy & Conglomerate" className="bg-dark">Energy & Conglomerate</option>
              <option value="Energy & Power" className="bg-dark">Energy & Power</option>
              <option value="Automotive" className="bg-dark">Automotive & EV</option>
              <option value="Consumer Goods & FMCG" className="bg-dark">Consumer Goods & FMCG</option>
              <option value="Healthcare & Pharma" className="bg-dark">Healthcare & Pharma</option>
              <option value="Metals & Mining" className="bg-dark">Metals & Mining</option>
              <option value="Telecommunication" className="bg-dark">Telecommunication</option>
              <option value="Defense & Aerospace" className="bg-dark">Defense & Aerospace</option>
              <option value="Infrastructure & Capital Goods" className="bg-dark">Infrastructure & Capital Goods</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select glass-input"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
            >
              <option value="symbol-asc" className="bg-dark">Symbol (A-Z)</option>
              <option value="symbol-desc" className="bg-dark">Symbol (Z-A)</option>
              <option value="currentPrice-desc" className="bg-dark">Price: High to Low</option>
              <option value="currentPrice-asc" className="bg-dark">Price: Low to High</option>
            </select>
          </div>

          <div className="col-md-2 text-end">
            <button className="btn btn-outline-secondary w-100" onClick={fetchStocks}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stocks Grid */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="col-md-6 col-lg-3">
              <Skeleton height="220px" />
            </div>
          ))}
        </div>
      ) : stocks.length === 0 ? (
        <div className="glass-card text-center py-5">
          <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
          <h5 className="text-light fw-bold">No Stocks Found</h5>
          <p className="text-muted">Try clearing search query or sector filters.</p>
        </div>
      ) : (
        <div className="row g-4">
          {stocks.map((stock) => (
            <div key={stock._id} className="col-md-6 col-lg-3">
              <StockCard stock={stock} liveData={liveStockUpdates} onTradeSuccess={fetchStocks} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <i className="bi bi-chevron-left me-1"></i> Previous
          </button>
          <span className="text-muted">
            Page <strong className="text-light">{page}</strong> of <strong className="text-light">{totalPages}</strong>
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
