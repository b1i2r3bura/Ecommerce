/**
 * ProductDetailPage.jsx — Editorial Product Detail & Related Pieces
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiShield,
  FiTruck,
  FiCheck,
  FiAlertCircle,
  FiMessageSquare,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import StarRating from '../../components/ui/StarRating';
import ProductCard from '../../components/product/ProductCard';
import { DetailSkeleton } from '../../components/ui/SkeletonLoader';
import { getImageUrl } from '../../utils/imageHelper';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductAndRelated = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/products/${id}`);
      const currentProd = res.data;
      setProduct(currentProd);

      // Fetch related products in same category
      if (currentProd?.category) {
        const relatedRes = await api.get(`/api/products?category=${encodeURIComponent(currentProd.category)}`);
        const filtered = (relatedRes.data.products || [])
          .filter((p) => p._id !== currentProd._id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [fetchProductAndRelated]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!product) return null;

  const itemInCart = cartItems.find((item) => item._id === product._id);
  const currentInCart = itemInCart ? itemInCart.quantity : 0;
  const availableStock = product.stock - currentInCart;
  const isOutOfStock = product.stock <= 0 || !product.inStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (qty > availableStock) {
      toast.error(`You have ${currentInCart} in cart. Only ${product.stock} total in stock.`);
      return;
    }
    addToCart(product, qty);
    setQty(1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.error('Please select a star rating');
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post(`/api/products/${product._id}/reviews`, {
        rating: Number(userRating),
        comment: userComment.trim(),
      });
      toast.success('Thank you. Your review has been published.');
      setUserComment('');
      setUserRating(5);
      fetchProductAndRelated();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="product-detail-page container animate-fade-in">
      {/* ── Breadcrumb Nav ────────────────────────────────────────── */}
      <div className="detail-breadcrumb">
        <Link to="/products" className="back-link">
          <FiArrowLeft size={15} /> All Products
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-cat">{product.category}</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-name">{product.name}</span>
      </div>

      {/* ── Main Product Display ──────────────────────────────────── */}
      <div className="product-hero-grid">
        {/* Left: Showcase Image */}
        <div className="detail-image-panel">
          <div className="detail-image-box">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="detail-main-img"
            />
            <span className="badge badge-secondary detail-cat-badge">{product.category}</span>
          </div>
        </div>

        {/* Right: Product Story, Pricing & Purchase */}
        <div className="detail-info-panel">
          <div className="detail-rating-row">
            <StarRating
              rating={product.averageRating || 0}
              numOfReviews={product.numOfReviews || 0}
              size={15}
            />
            <span className="detail-review-link">
              ({product.numOfReviews || 0} customer {product.numOfReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>

          <div className="detail-price-row">
            <span className="currency">$</span>
            <span className="price-val">{Number(product.price).toFixed(2)}</span>
            <span className="tax-included-note">Tax calculated at checkout</span>
          </div>

          {/* Stock Status */}
          <div className="detail-stock-row">
            {isOutOfStock ? (
              <span className="badge badge-error">
                <FiAlertCircle size={13} /> Sold Out
              </span>
            ) : product.stock <= 5 ? (
              <span className="badge badge-warning">
                <FiAlertCircle size={13} /> Low Inventory: {product.stock} Remaining
              </span>
            ) : (
              <span className="badge badge-success">
                <FiCheck size={13} /> In Stock ({product.stock} units available)
              </span>
            )}

            {currentInCart > 0 && (
              <span className="already-in-cart-note">({currentInCart} in your cart)</span>
            )}
          </div>

          <div className="detail-description-box">
            <h4 className="specs-heading">Overview & Specifications</h4>
            <p className="detail-desc-text">{product.description}</p>
          </div>

          {/* Quantity & Action */}
          {!isOutOfStock && (
            <div className="detail-purchase-row">
              <div className="qty-control-box">
                <button
                  type="button"
                  className="qty-step-btn"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={14} />
                </button>
                <span className="qty-count-text">{qty}</span>
                <button
                  type="button"
                  className="qty-step-btn"
                  onClick={() => setQty((prev) => Math.min(availableStock, prev + 1))}
                  disabled={qty >= availableStock}
                  aria-label="Increase quantity"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <button
                className="btn btn-primary btn-lg add-cart-btn"
                onClick={handleAddToCart}
                disabled={availableStock <= 0}
              >
                {availableStock <= 0
                  ? 'Maximum in Cart'
                  : `Add to Cart — $${(product.price * qty).toFixed(2)}`}
              </button>
            </div>
          )}

          <div className="detail-guarantees-grid">
            <div className="guarantee-item">
              <FiTruck size={17} className="g-icon" />
              <div>
                <h5>Complimentary Tracked Shipping</h5>
                <p>Express courier dispatched within 24 hours.</p>
              </div>
            </div>
            <div className="guarantee-item">
              <FiShield size={17} className="g-icon" />
              <div>
                <h5>2-Year Direct Guarantee</h5>
                <p>Official studio repair & replacement coverage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ──────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="section-head-bar">
            <div>
              <span className="editorial-label">Companion Pieces</span>
              <h2 className="section-title-serif">Related From This Department</h2>
            </div>
          </div>

          <div className="grid grid-4 related-grid">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}

      {/* ── Customer Reviews Section ──────────────────────────────── */}
      <section className="detail-reviews-section">
        <div className="section-head-bar">
          <div>
            <span className="editorial-label">Customer Feedback</span>
            <h2 className="section-title-serif">Verified Impressions ({product.numOfReviews || 0})</h2>
          </div>
        </div>

        <div className="reviews-two-col">
          {/* Reviews List */}
          <div className="reviews-list-container">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-stack">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="card review-item-card">
                    <div className="review-top-row">
                      <div className="reviewer-meta">
                        <span className="reviewer-name">{rev.name || 'Verified Customer'}</span>
                        <span className="review-time">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Buyer'}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size={13} />
                    </div>
                    {rev.comment && <p className="review-text">{rev.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card empty-reviews-card">
                <FiMessageSquare size={30} className="empty-rev-icon" />
                <h4>No Reviews Written Yet</h4>
                <p>Be the first customer to share your thoughts on this piece.</p>
              </div>
            )}
          </div>

          {/* Leave a Review Box */}
          <div className="review-submission-container">
            <div className="card review-form-card">
              <h3 className="review-form-title">Write a Review</h3>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="review-input-form">
                  <div className="form-group">
                    <label className="form-label">Rating (1 to 5 Stars)</label>
                    <StarRating
                      rating={userRating}
                      interactive={true}
                      onRatingChange={(newVal) => setUserRating(newVal)}
                      size={22}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Details</label>
                    <textarea
                      className="input review-textarea"
                      rows={4}
                      placeholder="Share notes on build quality, tactile feel, sound calibration..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-md"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Publishing...' : 'Publish Review'}
                  </button>
                </form>
              ) : (
                <div className="review-login-callout">
                  <p>Please sign in to your customer account to leave a verified rating.</p>
                  <Link to="/login" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-3)' }}>
                    Sign In to Review
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
