import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 my-5 text-center">
      <div className="glass-card p-5 max-w-lg mx-auto">
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 className="fw-bold text-light mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          The page or stock ticker route you requested does not exist or has been relocated.
        </p>
        <Link to="/dashboard" className="btn btn-primary-gradient px-4">
          <i className="bi bi-house me-2"></i> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
