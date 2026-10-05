/**
 * RegisterPage.jsx — Customer Registration
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import './Auth.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectTarget =
    location.state?.from?.pathname ||
    searchParams.get('redirect') ||
    '/';

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please complete all form fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      login(res.data);
      toast.success(`Welcome to ATELIER, ${res.data.name}`);
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page container animate-fade-in">
      <div className="card auth-card-box">
        <div className="auth-card-header">
          <span className="editorial-label">New Customer</span>
          <h1 className="auth-card-title">Create Account</h1>
          <p className="auth-card-sub">Register to place orders and manage your archival records</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form-body">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="input"
              required
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="input"
              required
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="input"
              required
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              className="input"
              required
              placeholder="Re-type password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Account'} <FiArrowRight size={16} />
          </button>
        </form>

        <div className="auth-card-footer">
          <span>Already registered?</span>
          <Link
            to={`/login${redirectTarget !== '/' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            className="auth-link"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
