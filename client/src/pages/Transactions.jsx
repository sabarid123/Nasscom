import React, { useState, useEffect } from 'react';
import * as tradeService from '../services/tradeService';
import Skeleton from '../components/Skeleton';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNotification } from '../hooks/useNotification';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useNotification();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await tradeService.getTransactions(page, 10);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleDeleteItem = async (id, symbol) => {
    if (!window.confirm(`Delete transaction log for ${symbol || 'trade'}?`)) return;
    try {
      await tradeService.deleteTransaction(id);
      addToast('info', 'Deleted', 'Transaction log removed');
      fetchTransactions();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to delete transaction');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear ALL transaction history?')) return;
    try {
      await tradeService.clearAllTransactions();
      addToast('success', 'History Cleared', 'All transaction logs cleared');
      fetchTransactions();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to clear history');
    }
  };

  return (
    <div className="container">
      <div className="glass-card p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-light mb-1">
            <i className="bi bi-receipt text-primary me-2"></i> Transaction History
          </h2>
          <p className="text-muted mb-0">Complete audit log of executed stock buy & sell trades.</p>
        </div>
        {transactions.length > 0 && (
          <button className="btn btn-outline-danger" onClick={handleClearAll}>
            <i className="bi bi-trash3 me-1"></i> Clear All History
          </button>
        )}
      </div>

      <div className="glass-card p-4">
        {loading ? (
          <Skeleton height="250px" width="100%" />
        ) : transactions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
            No trades executed yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="text-muted small">
                  <th>DATE & TIME</th>
                  <th>TYPE</th>
                  <th>STOCK</th>
                  <th className="text-end">QTY</th>
                  <th className="text-end">PRICE PER SHARE</th>
                  <th className="text-end">TOTAL AMOUNT</th>
                  <th className="text-center">STATUS</th>
                  <th className="text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const symbol = t.stockId ? t.stockId.symbol : 'STOCK';
                  return (
                    <tr key={t._id}>
                      <td>{formatDate(t.createdAt)}</td>
                      <td>
                        <span className={`badge ${t.type === 'BUY' ? 'bg-success' : 'bg-danger'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td>
                        <strong className="text-light">{symbol}</strong>
                        {t.stockId && <small className="text-muted d-block">{t.stockId.companyName}</small>}
                      </td>
                      <td className="text-end fw-semibold">{t.quantity}</td>
                      <td className="text-end">{formatCurrency(t.price)}</td>
                      <td className="text-end fw-bold">{formatCurrency(t.totalAmount)}</td>
                      <td className="text-center">
                        <span className="badge bg-secondary">{t.status}</span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteItem(t._id, symbol)}
                          title="Delete transaction record"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4 pt-3 border-top border-secondary">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
