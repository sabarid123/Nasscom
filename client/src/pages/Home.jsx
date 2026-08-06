import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row align-items-center g-5 py-5">
        <div className="col-lg-6 text-center text-lg-start">
          <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-pill fw-semibold mb-3 border border-primary">
            🚀 The #1 MERN Paper Trading Simulator
          </span>
          <h1 className="display-4 fw-bold text-light mb-3">
            Master the Stock Market <br />
            <span className="text-primary">Zero Financial Risk</span>
          </h1>
          <p className="lead text-muted mb-4">
            Experience real-time stock trading modeled after Zerodha, Robinhood, and TradingView. Get $50,000 in virtual cash, track live market ticks, build portfolios, and analyze trends.
          </p>
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary-gradient btn-lg px-4">
                Launch Market Dashboard <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary-gradient btn-lg px-4">
                  Open Free Account <i className="bi bi-person-plus ms-2"></i>
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4 text-center position-relative overflow-hidden">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-success rounded-circle p-2 text-white">
                  <i className="bi bi-graph-up fs-4"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0 text-light">AAPL • Apple Inc.</h6>
                  <small className="text-muted">Technology Sector</small>
                </div>
              </div>
              <div className="text-end">
                <h5 className="fw-bold text-success-custom mb-0">$185.50</h5>
                <small className="badge-gain">+1.85% Today</small>
              </div>
            </div>

            {/* Feature Mini Cards */}
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 glass-card text-start">
                  <i className="bi bi-lightning-charge text-warning fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold text-light mb-1">Real-Time Prices</h6>
                  <small className="text-muted">Live WebSocket ticks via Socket.IO</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 glass-card text-start">
                  <i className="bi bi-shield-check text-info fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold text-light mb-1">Atomic Execution</h6>
                  <small className="text-muted">Database rollback on trade errors</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 glass-card text-start">
                  <i className="bi bi-pie-chart text-success fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold text-light mb-1">Portfolio Analytics</h6>
                  <small className="text-muted">Doughnut charts & P&L tracking</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 glass-card text-start">
                  <i className="bi bi-sliders text-danger fs-3 mb-2 d-block"></i>
                  <h6 className="fw-bold text-light mb-1">Admin Panel</h6>
                  <small className="text-muted">Stock CRUD & User management</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
