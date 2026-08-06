import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('success', 'Reset Link Sent', 'If an account exists with this email, reset instructions have been dispatched.');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="glass-card p-4 p-md-5 text-center">
          <div
            className="bg-warning rounded-circle mx-auto d-flex align-items-center justify-content-center text-dark mb-3"
            style={{ width: '48px', height: '48px' }}
          >
            <i className="bi bi-key fs-4"></i>
          </div>
          <h3 className="fw-bold text-light mb-1">Forgot Password</h3>
          <p className="text-muted mb-4">Enter your email to receive password reset instructions</p>

          {submitted ? (
            <div className="alert alert-success bg-success bg-opacity-25 border-success text-light text-start mb-4">
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              Password reset link has been dispatched to <strong>{email}</strong>. Please check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control glass-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary-gradient w-100">
                Send Reset Link
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-top border-secondary">
            <Link to="/login" className="text-muted text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
