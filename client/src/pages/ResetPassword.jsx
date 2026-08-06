import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return addToast('danger', 'Password Mismatch', 'New passwords do not match.');
    }
    addToast('success', 'Password Reset Successful', 'Your password has been updated. Please login.');
    navigate('/login');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="glass-card p-4 p-md-5">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-light mb-1">Set New Password</h3>
            <p className="text-muted">Enter your new account password</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted">New Password</label>
              <input
                type="password"
                className="form-control glass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Confirm New Password</label>
              <input
                type="password"
                className="form-control glass-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary-gradient w-100 mt-2">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
