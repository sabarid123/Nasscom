import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency } from '../utils/formatters';
import Modal from './Modal';
import * as authService from '../services/authService';

const Navbar = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('info', 'Logged Out', 'You have been logged out successfully.');
    navigate('/login');
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) {
      return addToast('danger', 'Invalid Amount', 'Please enter a positive deposit amount.');
    }
    setIsSubmitting(true);
    try {
      const res = await authService.addFunds(Number(depositAmount));
      const updatedUser = res.data;
      if (updatedUser && updatedUser.walletBalance !== undefined) {
        updateUserProfile({ walletBalance: updatedUser.walletBalance });
      } else {
        const me = await authService.getMe();
        if (me.data && me.data.walletBalance !== undefined) {
          updateUserProfile({ walletBalance: me.data.walletBalance });
        }
      }
      addToast('success', 'Funds Added', `Added ${formatCurrency(Number(depositAmount))} to wallet!`);
      setDepositModalOpen(false);
      setDepositAmount('');
    } catch (err) {
      addToast('danger', 'Deposit Failed', err.message || 'Could not process deposit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-gradient" to="/">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ width: '38px', height: '38px' }}
            >
              <i className="bi bi-graph-up-arrow fs-5"></i>
            </div>
            <span className="fs-4">StockTrade</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/dashboard') ? 'active fw-bold' : ''}`} to="/dashboard">
                  <i className="bi bi-grid-1x2 me-1"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/watchlist') ? 'active fw-bold' : ''}`} to="/watchlist">
                  <i className="bi bi-bookmark-star me-1"></i> Watchlist
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/portfolio') ? 'active fw-bold' : ''}`} to="/portfolio">
                  <i className="bi bi-pie-chart me-1"></i> Portfolio
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/transactions') ? 'active fw-bold' : ''}`} to="/transactions">
                  <i className="bi bi-receipt me-1"></i> History
                </Link>
              </li>
              {user && user.role === 'ADMIN' && (
                <li className="nav-item">
                  <Link className={`nav-link px-3 text-warning ${isActive('/admin') ? 'active fw-bold' : ''}`} to="/admin">
                    <i className="bi bi-shield-lock me-1"></i> Admin Panel
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3">
              {user ? (
                <>
                  <div className="d-flex align-items-center gap-2 glass-card px-3 py-1">
                    <i className="bi bi-wallet2 text-success-custom fs-5"></i>
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                        Cash Balance
                      </span>
                      <strong className="text-light" style={{ fontSize: '0.9rem' }}>
                        {formatCurrency(user.walletBalance)}
                      </strong>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => setDepositModalOpen(true)}
                      title="Deposit Funds"
                    >
                      <i className="bi bi-plus-circle"></i>
                    </button>
                  </div>

                  <button
                    className="btn btn-outline-secondary rounded-circle"
                    onClick={toggleTheme}
                    title="Toggle Theme"
                    style={{ width: '38px', height: '38px' }}
                  >
                    <i className={`bi bi-${theme === 'dark' ? 'sun' : 'moon-stars'}`}></i>
                  </button>

                  <div className="dropdown">
                    <button
                      className="btn p-0 border-0 dropdown-toggle d-flex align-items-center gap-2"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <img
                        src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                        alt={user.name}
                        className="rounded-circle border border-primary"
                        width="38"
                        height="38"
                      />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end glass-card border-0 shadow mt-2">
                      <li className="px-3 py-2 border-bottom border-secondary">
                        <strong className="d-block text-light">{user.name}</strong>
                        <small className="text-muted">{user.email}</small>
                      </li>
                      <li>
                        <Link className="dropdown-item text-light my-1" to="/profile">
                          <i className="bi bi-person me-2"></i> Profile & Security
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider bg-secondary" />
                      </li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-light px-4">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary-gradient px-4">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Deposit Modal */}
      <Modal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} title="Add Cash to Wallet">
        <form onSubmit={handleDeposit}>
          <div className="mb-3">
            <label className="form-label text-muted">Amount ($ USD)</label>
            <input
              type="number"
              min="10"
              step="10"
              className="form-control glass-input"
              placeholder="e.g. 5000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setDepositModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success-gradient" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Deposit Funds'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Navbar;
