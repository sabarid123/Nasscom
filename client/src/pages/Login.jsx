import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginUser } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await loginUser({ email, password });
      addToast('success', 'Welcome Back!', `Logged in as ${user.name}`);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      addToast('danger', 'Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoUser = () => {
    setEmail('user@stocktrade.com');
    setPassword('UserPassword123!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@stocktrade.com');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="glass-card p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="bg-primary rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-2"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-box-arrow-in-right fs-4"></i>
            </div>
            <h3 className="fw-bold text-light mb-1">Welcome Back</h3>
            <p className="text-muted">Sign in to manage your stock portfolio</p>
          </div>

          {/* Demo Quick Fill Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className="btn btn-sm btn-outline-info flex-grow-1"
              onClick={fillDemoUser}
            >
              <i className="bi bi-person me-1"></i> Demo User
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning flex-grow-1"
              onClick={fillDemoAdmin}
            >
              <i className="bi bi-shield-lock me-1"></i> Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
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

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label text-muted mb-0">Password</label>
                <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ fontSize: '0.85rem' }}>
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                className="form-control glass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary-gradient w-100 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top border-secondary">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-primary fw-bold text-decoration-none ms-1">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
