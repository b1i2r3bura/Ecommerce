/**
 * LoginPage.jsx — Clean Architectural Sign In & Redirect Intercept
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectTarget =
    location.state?.from?.pathname ||
    searchParams.get('redirect') ||
    '/';

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      login(res.data);
      toast.success(`Welcome back, ${res.data.name}`);

      if (res.data.role === 'admin' && redirectTarget === '/') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTarget, { replace: true });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('john@example.com');
    setPassword('Customer@123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@shopwave.com');
    setPassword('Admin@123');
  };

  return (
    <div className="auth-page container animate-fade-in">
      <div className="card auth-card-box">
        <div className="auth-card-header">
          <span className="editorial-label">Account Access</span>
          <h1 className="auth-card-title">Sign In</h1>
          <p className="auth-card-sub">
            {redirectTarget.includes('checkout')
              ? 'Sign in to complete your checkout session'
              : 'Sign in to review order archives and account settings'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form-body">
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="input"
              required
              placeholder="you@example.com"
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
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <FiArrowRight size={16} />
          </button>
        </form>

        <div className="demo-credentials-strip">
          <span className="demo-strip-label">Sandbox Quick Sign In:</span>
          <div className="demo-btn-row">
            <button type="button" className="btn btn-secondary btn-sm" onClick={fillDemoCustomer}>
              Customer Demo
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={fillDemoAdmin}>
              <FiShield size={12} /> Admin Demo
            </button>
          </div>
        </div>

        <div className="auth-card-footer">
          <span>New to ATELIER?</span>
          <Link
            to={`/register${redirectTarget !== '/' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            className="auth-link"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
