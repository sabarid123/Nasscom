import React from 'react';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="glass-card p-4 p-md-5 text-center">
          <div
            className="bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-3"
            style={{ width: '56px', height: '56px' }}
          >
            <i className="bi bi-patch-check fs-2"></i>
          </div>
          <h3 className="fw-bold text-light mb-2">Email Verified!</h3>
          <p className="text-muted mb-4">
            Your email address has been successfully verified. You now have full access to paper trading features.
          </p>
          <Link to="/dashboard" className="btn btn-primary-gradient px-4">
            Go to Dashboard <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
