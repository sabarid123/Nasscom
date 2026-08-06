import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastContainer from '../components/ToastContainer';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="glass-card p-3">
              <h6 className="fw-bold text-warning mb-3 px-2">
                <i className="bi bi-shield-lock me-2"></i> Admin Control Panel
              </h6>
              <div className="nav flex-column nav-pills gap-1">
                <Link
                  to="/admin"
                  className={`nav-link text-light text-start ${isActive('/admin') ? 'bg-primary active' : ''}`}
                >
                  <i className="bi bi-speedometer2 me-2"></i> Analytics Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className={`nav-link text-light text-start ${isActive('/admin/users') ? 'bg-primary active' : ''}`}
                >
                  <i className="bi bi-people me-2"></i> Manage Users
                </Link>
                <Link
                  to="/admin/stocks"
                  className={`nav-link text-light text-start ${isActive('/admin/stocks') ? 'bg-primary active' : ''}`}
                >
                  <i className="bi bi-graph-up me-2"></i> Manage Stocks
                </Link>
                <Link
                  to="/admin/transactions"
                  className={`nav-link text-light text-start ${isActive('/admin/transactions') ? 'bg-primary active' : ''}`}
                >
                  <i className="bi bi-list-check me-2"></i> All Transactions
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
