/**
 * Navbar.jsx — Warm Architectural Minimalist Navigation
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiLogOut, FiShield, FiMenu, FiX, FiPackage } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const { userInfo, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
    setUserMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* ── Brand Logo ─────────────────────────────────────────── */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-text">ATELIER</span>
          <span className="brand-tagline">Craft & Goods</span>
        </Link>

        {/* ── Desktop Navigation Links ───────────────────────────── */}
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Catalog
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin ${isActive ? 'active' : ''}`}>
              <FiShield size={13} /> Admin
            </NavLink>
          )}
        </nav>

        {/* ── Right Actions ──────────────────────────────────────── */}
        <div className="navbar-actions">
          {/* Cart button */}
          <Link to="/cart" className="nav-action-btn cart-link" aria-label="Shopping Cart">
            <FiShoppingBag size={19} />
            <span className="cart-text">Cart</span>
            {cartCount > 0 && <span className="cart-pill">{cartCount}</span>}
          </Link>

          {/* User Account / Auth */}
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button
                className="nav-action-btn user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Account Menu"
              >
                <div className="user-avatar-badge">
                  {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-firstname">{userInfo?.name?.split(' ')[0]}</span>
              </button>

              {userMenuOpen && (
                <div className="user-menu-dropdown animate-fade-in">
                  <div className="dropdown-user-meta">
                    <span className="meta-name">{userInfo?.name}</span>
                    <span className="meta-email">{userInfo?.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiUser size={15} /> Account Settings
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <FiPackage size={15} /> Order History
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiShield size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </div>
              )}

              {userMenuOpen && (
                <div className="dropdown-overlay" onClick={() => setUserMenuOpen(false)} />
              )}
            </div>
          ) : (
            <div className="auth-actions-group">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            className="nav-action-btn mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ─────────────────────────────────── */}
      {menuOpen && (
        <div className="mobile-nav-panel animate-fade-in">
          <NavLink to="/" end className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Catalog
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>

          {isAuthenticated ? (
            <>
              <div className="mobile-divider" />
              <NavLink to="/orders" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                My Orders
              </NavLink>
              <NavLink to="/profile" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Account Settings
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  Admin Workspace
                </NavLink>
              )}
              <button className="mobile-nav-link mobile-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-row">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
