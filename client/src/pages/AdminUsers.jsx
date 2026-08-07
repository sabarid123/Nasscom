import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';
import Skeleton from '../components/Skeleton';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useNotification } from '../hooks/useNotification';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useNotification();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(page, 10);
      setUsers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (err) {
      addToast('danger', 'Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminService.updateUserStatus(userId, { status: newStatus });
      addToast('info', 'Status Updated', `User status changed to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to update user status');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    try {
      await adminService.updateUserStatus(userId, { role: newRole });
      addToast('success', 'Role Updated', `User role changed to ${newRole}`);
      fetchUsers();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      addToast('success', 'Deleted', 'User account permanently removed');
      fetchUsers();
    } catch (err) {
      addToast('danger', 'Error', 'Failed to delete user');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/v1/admin/reports/export-users', '_blank');
    addToast('success', 'Exporting CSV', 'Downloading system users report...');
  };

  return (
    <div>
      <div className="glass-card p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-light mb-1">
            <i className="bi bi-people me-2 text-primary"></i> User Management
          </h3>
          <p className="text-muted mb-0">Manage roles, suspend accounts, and export user data files.</p>
        </div>
        <button className="btn btn-outline-success" onClick={handleExportCSV}>
          <i className="bi bi-download me-2"></i> Export Users CSV File
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
                  <th>USER</th>
                  <th>ROLE</th>
                  <th className="text-end">WALLET CASH</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong className="text-light">{u.name}</strong>
                      <small className="text-muted d-block">{u.email}</small>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.role === 'ADMIN' ? 'btn-warning text-dark' : 'btn-outline-primary'}`}
                        onClick={() => handleToggleRole(u._id, u.role)}
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="text-end fw-bold">{formatCurrency(u.walletBalance)}</td>
                    <td>
                      <span className={`badge ${u.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'} me-2`}
                        onClick={() => handleToggleStatus(u._id, u.status)}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u._id)}
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

export default AdminUsers;
