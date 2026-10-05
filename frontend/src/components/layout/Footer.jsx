/**
 * Footer.jsx — Warm Architectural Editorial Footer
 */

import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* ── Value Props Strip ─────────────────────────────────────── */}
      <div className="footer-values-strip">
        <div className="container footer-values-grid">
          <div className="footer-value-item">
            <FiTruck size={20} className="val-icon" />
            <div>
              <h5 className="val-title">Direct Express Delivery</h5>
              <p className="val-desc">Complimentary tracked shipping on all orders over $150.</p>
            </div>
          </div>
          <div className="footer-value-item">
            <FiShield size={20} className="val-icon" />
            <div>
              <h5 className="val-title">Two-Year Guarantee</h5>
              <p className="val-desc">Every piece inspected and covered by our warranty.</p>
            </div>
          </div>
          <div className="footer-value-item">
            <FiRefreshCw size={20} className="val-icon" />
            <div>
              <h5 className="val-title">30-Day Thoughtful Returns</h5>
              <p className="val-desc">Hassle-free exchanges and instant refunds.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ──────────────────────────────────────── */}
      <div className="container footer-body">
        <div className="footer-col footer-col-brand">
          <Link to="/" className="footer-brand-title">ATELIER</Link>
          <p className="footer-brand-text">
            Thoughtfully curated goods for modern work, audio, and daily life. Built with enduring materials and minimal fuss.
          </p>
          <div className="footer-editorial-note">
            <span>Designed for longevity • Crafted with care</span>
          </div>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Collection</h5>
          <ul className="footer-links-list">
            <li><Link to="/products">All Goods</Link></li>
            <li><Link to="/products?category=Electronics">Electronics & Audio</Link></li>
            <li><Link to="/products?category=Accessories">Desk & Lifestyle</Link></li>
            <li><Link to="/products?sort=rating">Top Rated Pieces</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5 className="footer-heading">Company</h5>
          <ul className="footer-links-list">
            <li><Link to="/about">Our Philosophy</Link></li>
            <li><Link to="/contact">Get in Touch</Link></li>
            <li><Link to="/profile">Account Settings</Link></li>
            <li><Link to="/orders">Track Orders</Link></li>
          </ul>
        </div>

        <div className="footer-col footer-col-newsletter">
          <h5 className="footer-heading">The Studio Journal</h5>
          <p className="newsletter-desc">
            Receive private release notes, seasonal archives, and design dispatches.
          </p>
          <form className="footer-newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to our studio dispatches.'); }}>
            <input
              type="email"
              placeholder="Your email address"
              className="input newsletter-input"
              required
            />
            <button type="submit" className="btn btn-primary btn-sm newsletter-btn" aria-label="Subscribe">
              <FiArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Bottom Strip ──────────────────────────────────────────── */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} ATELIER Goods. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/about">Ethics & Sustainability</Link>
            <span className="dot">•</span>
            <Link to="/contact">Customer Support</Link>
            
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
