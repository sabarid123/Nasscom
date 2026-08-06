import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="glass-nav border-top border-secondary mt-auto py-4">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <h5 className="fw-bold text-light mb-1">
              <i className="bi bi-graph-up-arrow me-2 text-primary"></i>
              StockTrade Platform
            </h5>
            <small className="text-muted">
              Next-Generation MERN Paper Trading & Investment Simulator. Simulated financial data.
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-2">
              <Link to="/dashboard" className="text-muted text-decoration-none">
                Dashboard
              </Link>
              <Link to="/watchlist" className="text-muted text-decoration-none">
                Watchlist
              </Link>
              <Link to="/portfolio" className="text-muted text-decoration-none">
                Portfolio
              </Link>
              <Link to="/transactions" className="text-muted text-decoration-none">
                History
              </Link>
            </div>
            <small className="text-muted">
              &copy; {new Date().getFullYear()} StockTrade Inc. All rights reserved. Built with React 19, Express, & MongoDB.
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
