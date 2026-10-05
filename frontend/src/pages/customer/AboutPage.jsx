/**
 * AboutPage.jsx — Studio Philosophy, Story & Craftsmanship
 */

import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiShield, FiFeather, FiBox } from 'react-icons/fi';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page container animate-fade-in">
      {/* ── Editorial Header ───────────────────────────────────────── */}
      <section className="about-hero">
        <span className="editorial-label">About the Studio</span>
        <h1 className="about-title">
          We believe objects should be made to <span className="serif-highlight">endure</span>, not to be replaced.
        </h1>
        <p className="about-lead">
          Founded on principles of architectural restraint, honest materiality, and straightforward pricing, ATELIER creates and curates tools for daily life that grow better with use.
        </p>
      </section>

      {/* ── Visual Story Split ─────────────────────────────────────── */}
      <section className="about-story-section">
        <div className="story-grid">
          <div className="story-image-box">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=85"
              alt="Studio workshop craftsmanship"
              className="story-img"
            />
          </div>
          <div className="story-content-box">
            <h2 className="story-heading">A Counter-Reaction to Disposable Culture</h2>
            <p className="story-paragraph">
              In a marketplace inundated with mass-produced gadgets and planned obsolescence, we chose a deliberate path: partnering with independent workshops and precision manufacturers who value tactile feedback, repairability, and acoustic honesty.
            </p>
            <p className="story-paragraph">
              Every headphone, mechanical desk keyboard, and lifestyle piece in our catalog is rigorously stress-tested in real working environments for over 300 hours before being offered to our community.
            </p>

            <div className="story-pillars">
              <div className="pillar-item">
                <FiFeather className="pillar-icon" size={20} />
                <div>
                  <h4>Zero Gimmicks</h4>
                  <p>No artificial hype or inflated feature lists. Just honest performance.</p>
                </div>
              </div>
              <div className="pillar-item">
                <FiShield className="pillar-icon" size={20} />
                <div>
                  <h4>2-Year Direct Warranty</h4>
                  <p>If something fails under normal wear, we repair or replace it immediately.</p>
                </div>
              </div>
              <div className="pillar-item">
                <FiBox className="pillar-icon" size={20} />
                <div>
                  <h4>Responsible Packaging</h4>
                  <p>100% unbleached recycled cardboard with zero non-recyclable single-use plastics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Banner ──────────────────────────────────────────── */}
      <section className="quote-banner">
        <blockquote className="editorial-quote">
          "Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects."
        </blockquote>
        <cite className="quote-author">— Dieter Rams, Ten Principles for Good Design</cite>
      </section>

      {/* ── Call to Explore ───────────────────────────────────────── */}
      <section className="about-cta-section">
        <div className="about-cta-card">
          <h2 className="cta-title">Explore Our Curated Catalog</h2>
          <p className="cta-subtitle">Discover precision-engineered audio, desk accessories, and lifestyle essentials.</p>
          <div className="cta-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              View Catalog <FiArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
