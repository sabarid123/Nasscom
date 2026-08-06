import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';
import Skeleton from '../components/Skeleton';
import { formatCurrency } from '../utils/formatters';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await adminService.getAdminAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <Skeleton height="80px" width="100%" className="mb-4" />
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="col-md-4">
              <Skeleton height="140px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { totalUsers, activeUsers, totalStocks, totalTransactions, totalVolume, totalWalletFunds } =
    analytics || {};

  return (
    <div>
      <div className="glass-card p-4 mb-4">
        <h3 className="fw-bold text-light mb-1">
          <i className="bi bi-speedometer2 text-warning me-2"></i> System Analytics Overview
        </h3>
        <p className="text-muted mb-0">High-level platform performance metrics and activity monitors.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="glass-card p-4">
            <span className="text-muted small d-block mb-1">Total Users</span>
            <h2 className="fw-bold text-light mb-1">{totalUsers}</h2>
            <small className="text-success-custom">Active Users: {activeUsers}</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4">
            <span className="text-muted small d-block mb-1">Listed Stocks</span>
            <h2 className="fw-bold text-info mb-1">{totalStocks}</h2>
            <small className="text-muted">Active symbols</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass-card p-4">
            <span className="text-muted small d-block mb-1">Total Trades Executed</span>
            <h2 className="fw-bold text-warning mb-1">{totalTransactions}</h2>
            <small className="text-muted">Completed orders</small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card p-4">
            <span className="text-muted small d-block mb-1">Total Trading Volume</span>
            <h2 className="fw-bold text-success-custom mb-1">{formatCurrency(totalVolume)}</h2>
            <small className="text-muted">Cumulative gross trade value</small>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card p-4">
            <span className="text-muted small d-block mb-1">Total System Cash Reserves</span>
            <h2 className="fw-bold text-primary mb-1">{formatCurrency(totalWalletFunds)}</h2>
            <small className="text-muted">Combined user wallet balances</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
