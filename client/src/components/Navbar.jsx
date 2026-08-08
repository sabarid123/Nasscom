import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNotification } from '../hooks/useNotification';
import { formatCurrency } from '../utils/formatters';
import Modal from './Modal';
import * as authService from '../services/authService';
import axios from 'axios';

const Navbar = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [indices, setIndices] = useState([
    { symbol: 'NIFTY 50', name: 'NIFTY 50', value: 24350.40, change: 112.30, changePercent: 0.46 },
    { symbol: 'BANKNIFTY', name: 'BANK NIFTY', value: 51820.15, change: -145.20, changePercent: -0.28 },
    { symbol: 'SENSEX', name: 'BSE SENSEX', value: 79910.80, change: 320.50, changePercent: 0.40 },
    { symbol: 'FINNIFTY', name: 'NIFTY FIN SERVICE', value: 23410.60, change: 45.10, changePercent: 0.19 },
  ]);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await axios.get('/api/v1/stocks/indices');
        if (res.data?.data) {
          setIndices(res.data.data);
        }
      } catch (_) {}
    };
    fetchIndices();
    const timer = setInterval(fetchIndices, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('info', 'Logged Out', 'You have been logged out successfully.');
    navigate('/login');
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      return addToast('danger', 'Invalid Amount', 'Please enter a positive deposit amount.');
    }
    setIsSubmitting(true);
    try {
      const res = await authService.addFunds(amount);
      const updatedUser = res.data;
      if (updatedUser && updatedUser.walletBalance !== undefined) {
        updateUserProfile({ walletBalance: updatedUser.walletBalance });
      } else {
        const me = await authService.getMe();
        if (me.data && me.data.walletBalance !== undefined) {
          updateUserProfile({ walletBalance: me.data.walletBalance });
        }
      }
      addToast('success', 'Funds Added', `Added ${formatCurrency(amount)} to trading wallet!`);
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
      {/* Top Angel One / Groww Market Indices Bar */}
      <div className="bg-dark border-bottom border-secondary border-opacity-25 py-1 px-3 text-light" style={{ fontSize: '0.8rem' }}>
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-4 overflow-x-auto py-1">
            {indices.map((idx) => {
              const isUp = idx.change >= 0;
              return (
                <div key={idx.symbol} className="d-flex align-items-center gap-2 text-nowrap">
                  <span className="fw-bold text-muted">{idx.name}</span>
                  <span className="fw-bold text-light">{idx.value.toLocaleString('en-IN')}</span>
                  <span className={isUp ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                    <i className={`bi bi-caret-${isUp ? 'up' : 'down'}-fill me-1`}></i>
                    {isUp ? '+' : ''}{idx.change} ({isUp ? '+' : ''}{idx.changePercent}%)
                  </span>
                </div>
              );
            })}
          </div>
          <div className="d-none d-md-flex align-items-center gap-2 text-muted">
            <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '6px', height: '6px' }}></span>
            <span>NSE/BSE LIVE MARKET</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top py-2">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-gradient" to="/">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
              style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #00d09c 0%, #5367ff 100%)' }}
            >
              <i className="bi bi-graph-up-arrow fs-5"></i>
            </div>
            <span className="fs-4 tracking-tight">GrowwTrade</span>
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
                  <i className="bi bi-grid-1x2 me-1"></i> Explore
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
                  <i className="bi bi-clock-history me-1"></i> Orders
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/option-chain') ? 'active fw-bold text-info' : ''}`} to="/option-chain">
                  <i className="bi bi-lightning-charge me-1"></i> F&O Options
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link px-3 ${isActive('/ipo-mf') ? 'active fw-bold text-success' : ''}`} to="/ipo-mf">
                  <i className="bi bi-box-seam me-1"></i> IPOs & MF
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
                  <div className="d-flex align-items-center gap-2 glass-card px-3 py-1 border border-secondary border-opacity-25 rounded-pill">
                    <i className="bi bi-wallet2 text-success fs-5"></i>
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                        Trading Balance
                      </span>
                      <strong className="text-light" style={{ fontSize: '0.85rem' }}>
                        {formatCurrency(user.walletBalance)}
                      </strong>
                    </div>
                    <button
                      className="btn btn-sm btn-success rounded-circle ms-2 p-0 d-flex align-items-center justify-content-center"
                      onClick={() => setDepositModalOpen(true)}
                      title="Add Money to Wallet"
                      style={{ width: '26px', height: '26px' }}
                    >
                      <i className="bi bi-plus"></i>
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
                      <li className="px-3 py-2 border-bottom border-secondary border-opacity-25">
                        <strong className="d-block text-light">{user.name}</strong>
                        <small className="text-muted">{user.email}</small>
                      </li>
                      <li>
                        <Link className="dropdown-item text-light my-1" to="/profile">
                          <i className="bi bi-person me-2"></i> Profile & Wallet
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider bg-secondary bg-opacity-25" />
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
                  <Link to="/login" className="btn btn-outline-light px-4 rounded-pill">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-success fw-bold px-4 rounded-pill">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Deposit Modal */}
      <Modal isOpen={depositModalOpen} onClose={() => setDepositModalOpen(false)} title="Add Cash to Trading Wallet">
        <form onSubmit={handleDeposit}>
          <div className="mb-3">
            <label className="form-label text-muted small">Amount (₹ INR)</label>
            <input
              type="number"
              min="100"
              step="500"
              className="form-control glass-input text-light"
              placeholder="e.g. 50000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              required
            />
          </div>
          <div className="d-flex gap-2 mb-3">
            {[5000, 10000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                type="button"
                className="btn btn-sm btn-outline-secondary flex-grow-1"
                onClick={() => setDepositAmount(amt.toString())}
              >
                +₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setDepositModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success fw-bold px-4" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Funds...' : 'Add Money'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Navbar;
