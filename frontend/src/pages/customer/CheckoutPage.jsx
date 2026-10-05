/**
 * CheckoutPage.jsx — Clean Architectural Order Placement
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiShoppingBag, FiTruck, FiArrowLeft, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { getImageUrl } from '../../utils/imageHelper';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { userInfo } = useAuth();
  const { cartItems, cartSubTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('452 Craftsmanship Lane');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94107');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taxAmount = cartSubTotal * 0.15;
  const grandTotal = cartSubTotal + taxAmount;

  if (cartItems.length === 0) {
    return (
      <div className="container checkout-empty-box animate-fade-in">
        <FiShoppingBag size={44} className="empty-bag-icon" />
        <h2>Your Shopping Bag is Empty</h2>
        <p>You cannot checkout without pieces in your bag.</p>
        <Link to="/products" className="btn btn-primary btn-md" style={{ marginTop: 'var(--space-3)' }}>
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      toast.error('Please complete all delivery fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        paymentMethod,
      };

      const res = await api.post('/api/orders', payload);
      const createdOrder = res.data;

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${createdOrder._id}`, { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to place order';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container animate-fade-in">
      <div className="checkout-top-bar">
        <Link to="/cart" className="back-link">
          <FiArrowLeft size={15} /> Return to Shopping Bag
        </Link>
        <div>
          <span className="editorial-label">Final Step</span>
          <h1 className="checkout-title">Complete Your Order</h1>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-grid-layout">
        {/* ── Left Column: Shipping & Payment ────────────────────── */}
        <div className="checkout-steps-column">
          {/* Step 1: Customer */}
          <div className="card checkout-section-card">
            <div className="step-title-row">
              <span className="step-number">01</span>
              <h3>Customer Account</h3>
            </div>
            <div className="customer-preview-box">
              <span className="preview-label">Ordering Account:</span>
              <span className="preview-val">{userInfo?.name} ({userInfo?.email})</span>
            </div>
          </div>

          {/* Step 2: Shipping */}
          <div className="card checkout-section-card">
            <div className="step-title-row">
              <span className="step-number">02</span>
              <h3>Delivery Destination</h3>
            </div>

            <div className="form-grid-2">
              <div className="form-group form-col-span-2">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="Street address or P.O. Box"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / Zip Code *</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="Zip / Postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="form-group form-col-span-2">
                <label className="form-label">Country *</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment */}
          <div className="card checkout-section-card">
            <div className="step-title-row">
              <span className="step-number">03</span>
              <h3>Payment Method (Development Simulation)</h3>
            </div>

            <div className="payment-options-stack">
              <label className={`payment-pill-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="pill-text-block">
                  <span className="pill-title">Instant Electronic Settlement (Test Sandbox)</span>
                  <span className="pill-sub">Simulates instant authorization without charging real cards.</span>
                </div>
              </label>

              <label className={`payment-pill-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="pill-text-block">
                  <span className="pill-title">Pay on Delivery</span>
                  <span className="pill-sub">Settle payment upon physical courier handover.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right Column: Order Review ─────────────────────────── */}
        <div className="checkout-review-column">
          <div className="card checkout-review-panel">
            <h3 className="review-panel-title">Order Overview ({cartItems.length})</h3>

            <div className="review-items-stack">
              {cartItems.map((item) => (
                <div key={item._id} className="review-item-row">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="review-item-thumb"
                  />
                  <div className="review-item-meta">
                    <span className="review-item-title">{item.name}</span>
                    <span className="review-item-calc">
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  <span className="review-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-hr" />

            <div className="summary-price-lines">
              <div className="price-line">
                <span>Items Subtotal</span>
                <span>${cartSubTotal.toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Calculated Tax (15%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Direct Courier Shipping</span>
                <span className="free-tag">COMPLIMENTARY</span>
              </div>

              <div className="summary-hr" />

              <div className="price-line grand-total-line">
                <span>Total Amount Due</span>
                <span className="grand-val">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Confirming Order...'
              ) : (
                <>
                  <FiLock size={16} /> Place Order — ${grandTotal.toFixed(2)}
                </>
              )}
            </button>

            <div className="review-guarantee-strip">
              <div className="g-item">
                <FiTruck size={14} /> Direct Express Courier
              </div>
              <div className="g-item">
                <FiCheckCircle size={14} /> Immediate Stock Lock
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
