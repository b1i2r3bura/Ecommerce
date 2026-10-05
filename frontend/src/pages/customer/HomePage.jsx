/**
 * HomePage.jsx — Warm Architectural Editorial Landing
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiFeather } from 'react-icons/fi';
import api from '../../api/axios';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/SkeletonLoader';
import { getImageUrl } from '../../utils/imageHelper';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/products');
        const prods = res.data.products || [];
        setCategories(res.data.categories || []);
        
        // Pick top rated pieces for featured section
        const topRated = [...prods]
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 4);
        setFeaturedProducts(topRated.length > 0 ? topRated : prods.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* ── 1. Editorial Hero Section ──────────────────────────────── */}
      <section className="editorial-hero">
        <div className="container hero-layout" /* style={{textAlign : 'center', marginLeft: '30%', marginTop: '2%'}} */  >
          <div className="hero-text-col">
            <span className="hero-kicker">Autumn / Winter Studio Collection</span>
            <h1 className="hero-headline">
              Tools for <span className="serif-italic">Focus</span>, Sound & Daily Life.
            </h1>
            <p className="hero-lead">
              A curated catalog of precision audio instruments, tactile mechanical keyboards, and architectural desk accessories. Built with enduring materials and zero gimmicks.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Catalog <FiArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                Our Philosophy
              </Link>
            </div>
            </div>

          {/* <div className="hero-image-col">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=85"
                alt="Precision over-ear headphones"
                className="hero-main-img"
              />
              <div className="hero-image-caption">
                <span className="caption-tag">Edition 01</span>
                <span className="caption-title">Wireless Active Noise Cancellation</span>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* ── 2. Curated Categories ──────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="container">
            <div className="section-head-bar">
              <div>
                <span className="editorial-label">Categories</span>
                <h2 className="section-title-serif">Curated Departments</h2>
              </div>
              <Link to="/products" className="btn btn-ghost btn-sm">
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="categories-tiles-grid">
              {categories.map((cat, idx) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="category-tile card"
                >
                  <div className="category-tile-meta">
                    <span className="tile-num">0{idx + 1}</span>
                    <h3 className="tile-name">{cat}</h3>
                  </div>
                  <div className="tile-action">
                    <span>Explore Department</span>
                    <FiArrowRight size={14} className="tile-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Top-Rated Collection ────────────────────────────────── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-head-bar">
            <div>
              <span className="editorial-label">Selected Works</span>
              <h2 className="section-title-serif">Top-Rated Essentials</h2>
            </div>
            <Link to="/products" className="btn btn-secondary btn-sm">
              All Products <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-4 products-grid">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1 / -1' }}>
                No products found.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Brand Philosophy Story Strip ────────────────────────── */}
      <section className="craft-story-strip">
        <div className="container story-strip-grid">
          <div className="story-strip-content">
            <span className="editorial-label">Studio Craft</span>
            <h2 className="story-strip-title">
              Designed with restraint. Engineered for longevity.
            </h2>
            <p className="story-strip-text">
              We reject planned obsolescence. Every product in our archive is selected for tactile feedback, premium acoustic calibration, and durable physical construction.
            </p>
            <Link to="/about" className="btn btn-primary btn-md">
              Read Studio Philosophy <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="story-strip-features">
            <div className="strip-feature">
              <FiFeather className="feature-icon" size={20} />
              <div>
                <h4>Honest Acoustic Calibration</h4>
                <p>Neutral, balanced sound signatures that honor the original master recording.</p>
              </div>
            </div>
            <div className="strip-feature">
              <FiShield className="feature-icon" size={20} />
              <div>
                <h4>Rigorous 300-Hour Stress Testing</h4>
                <p>Every batch verified for continuous daily performance and longevity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
