import React, { useState, useEffect } from 'react';
import * as stockService from '../services/stockService';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/formatters';
import { useNotification } from '../hooks/useNotification';

const AdminStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);

  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Technology');
  const [currentPrice, setCurrentPrice] = useState('');
  const [marketCap, setMarketCap] = useState('$1 Billion');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useNotification();

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await stockService.getStocks({ limit: 100 });
      setStocks(res.data.stocks);
    } catch (err) {
      addToast('danger', 'Error', 'Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const openCreateModal = () => {
    setEditingStock(null);
    setSymbol('');
    setCompanyName('');
    setSector('Technology');
    setCurrentPrice('');
    setMarketCap('$1 Billion');
    setModalOpen(true);
  };

  const openEditModal = (stock) => {
    setEditingStock(stock);
    setSymbol(stock.symbol);
    setCompanyName(stock.companyName);
    setSector(stock.sector);
    setCurrentPrice(stock.currentPrice);
    setMarketCap(stock.marketCap);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStock) {
        await stockService.updateStock(editingStock._id, {
          companyName,
          sector,
          currentPrice: Number(currentPrice),
          marketCap,
        });
        addToast('success', 'Stock Updated', `${symbol} details saved`);
      } else {
        await stockService.createStock({
          symbol,
          companyName,
          sector,
          currentPrice: Number(currentPrice),
          marketCap,
        });
        addToast('success', 'Stock Created', `Symbol ${symbol.toUpperCase()} listed successfully`);
      }
      setModalOpen(false);
      fetchStocks();
    } catch (err) {
      addToast('danger', 'Error', err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, sym) => {
    if (!window.confirm(`Delete ${sym} stock listing?`)) return;
    try {
      await stockService.deleteStock(id);
      addToast('success', 'Stock Deleted', `${sym} listing removed`);
      fetchStocks();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to delete stock');
    }
  };

  return (
    <div>
      <div className="glass-card p-4 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold text-light mb-1">
            <i className="bi bi-graph-up me-2 text-info"></i> Manage Stocks
          </h3>
          <p className="text-muted mb-0">Create, update, and remove market securities.</p>
        </div>
        <button className="btn btn-primary-gradient" onClick={openCreateModal}>
          <i className="bi bi-plus-lg me-1"></i> Add Stock Symbol
        </button>
      </div>

      <div className="glass-card p-4">
        {loading ? (
          <Skeleton height="250px" width="100%" />
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="text-muted small">
                  <th>SYMBOL</th>
                  <th>COMPANY</th>
                  <th>SECTOR</th>
                  <th className="text-end">CURRENT PRICE</th>
                  <th className="text-end">MARKET CAP</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr key={s._id}>
                    <td className="fw-bold text-light">{s.symbol}</td>
                    <td>{s.companyName}</td>
                    <td><span className="badge bg-secondary">{s.sector}</span></td>
                    <td className="text-end fw-bold">{formatCurrency(s.currentPrice)}</td>
                    <td className="text-end text-muted">{s.marketCap}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => openEditModal(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s._id, s.symbol)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStock ? `Edit ${editingStock.symbol}` : 'Add New Stock Symbol'}
      >
        <form onSubmit={handleSubmit}>
          {!editingStock && (
            <div className="mb-3">
              <label className="form-label text-muted">Stock Symbol</label>
              <input
                type="text"
                className="form-control glass-input"
                placeholder="e.g. AAPL"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label text-muted">Company Name</label>
            <input
              type="text"
              className="form-control glass-input"
              placeholder="e.g. Apple Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Sector</label>
            <select
              className="form-select glass-input"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="Technology" className="bg-dark">Technology</option>
              <option value="Financial Services" className="bg-dark">Financial Services</option>
              <option value="Consumer Cyclical" className="bg-dark">Consumer Cyclical</option>
              <option value="Automotive" className="bg-dark">Automotive</option>
              <option value="Communication Services" className="bg-dark">Communication Services</option>
              <option value="Energy" className="bg-dark">Energy</option>
              <option value="Healthcare" className="bg-dark">Healthcare</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted">Current Price ($ USD)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-control glass-input"
              placeholder="150.00"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-muted">Market Cap</label>
            <input
              type="text"
              className="form-control glass-input"
              placeholder="$1.5 Trillion"
              value={marketCap}
              onChange={(e) => setMarketCap(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary-gradient" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingStock ? 'Save Changes' : 'Create Stock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStocks;
