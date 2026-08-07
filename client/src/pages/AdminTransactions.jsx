import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';
import Skeleton from '../components/Skeleton';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNotification } from '../hooks/useNotification';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useNotification();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllTransactions(page, 10);
      setTransactions(res.data.transactions);
      setTotalPages(res.data.pages);
    } catch (err) {
      addToast('danger', 'Error', 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const handleExportCSV = () => {
    window.open('/api/v1/admin/reports/export-transactions', '_blank');
    addToast('success', 'Exporting CSV', 'Downloading system transaction report...');
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this system transaction record?')) return;
    try {
      await adminService.deleteTransaction(id);
      fetchTransactions();
      addToast('info', 'Deleted', 'Record removed');
    } catch (err) {
      fetchTransactions();
    }
  };

  return (
    <div>
      <div className="glass-card p-4 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold text-light mb-1">
            <i className="bi bi-list-check me-2 text-warning"></i> System Transactions
          </h3>
          <p className="text-muted mb-0">Audit history for all platform orders.</p>
        </div>
        <button className="btn btn-outline-success" onClick={handleExportCSV}>
          <i className="bi bi-download me-2"></i> Export CSV Report
        </button>
      </div>

      <div className="glass-card p-4">
        {loading ? (
          <Skeleton height="250px" width="100%" />
        ) : transactions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No system transactions logged yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="text-muted small">
                  <th>TIMESTAMP</th>
                  <th>USER</th>
                  <th>TYPE</th>
                  <th>STOCK</th>
                  <th className="text-end">QTY</th>
                  <th className="text-end">PRICE</th>
                  <th className="text-end">TOTAL VALUE</th>
                  <th className="text-center">STATUS</th>
                  <th className="text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>{formatDate(t.createdAt)}</td>
                    <td>
                      <strong className="text-light">{t.userId ? t.userId.name : 'N/A'}</strong>
                      <small className="text-muted d-block">{t.userId ? t.userId.email : ''}</small>
                    </td>
                    <td>
                      <span className={`badge ${t.type === 'BUY' ? 'bg-success' : 'bg-danger'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="fw-bold text-light">
                      {t.stockId ? t.stockId.symbol : 'N/A'}
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
                        onClick={() => handleDeleteRecord(t._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
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

export default AdminTransactions;
