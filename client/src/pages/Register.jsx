import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerUser } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await registerUser({ name, email, password, phone });
      addToast('success', 'Account Created!', `Welcome to StockTrade, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      addToast('danger', 'Registration Failed', err.message || 'Could not complete registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="glass-card p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="bg-success rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-2"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-person-plus fs-4"></i>
            </div>
            <h3 className="fw-bold text-light mb-1">Create Free Account</h3>
            <p className="text-muted">Start trading with $50,000 virtual capital</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted">Full Name</label>
              <input
                type="text"
                className="form-control glass-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <label className="form-label text-muted">Phone Number (Optional)</label>
              <input
                type="tel"
                className="form-control glass-input"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Password (Min. 6 chars)</label>
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

            <button type="submit" className="btn btn-success-gradient w-100 mt-2" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Register & Start Trading'}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top border-secondary">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-primary fw-bold text-decoration-none ms-1">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
