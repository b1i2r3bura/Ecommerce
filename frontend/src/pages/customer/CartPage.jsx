/**
 * CartPage.jsx — Clean Architectural Cart Management
 */

import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiShoppingBag, FiShield, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import EmptyState from '../../components/ui/EmptyState';
import { getImageUrl } from '../../utils/imageHelper';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubTotal } = useCart();
  const navigate = useNavigate();

  const taxAmount = cartSubTotal * 0.15;
  const grandTotal = cartSubTotal + taxAmount;

  if (cartItems.length === 0) {
    return (
      <div className="container cart-page animate-fade-in">
        <EmptyState
          icon={FiShoppingBag}
          title="Your Shopping Bag is Empty"
          description="You currently have no pieces in your bag. Explore our curated catalog to begin building your setup."
          actionLabel="Explore Catalog"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="cart-page container animate-fade-in">
      <div className="cart-header-row">
        <div>
          <span className="editorial-label">Review Selection</span>
          <h1 className="cart-page-title">Shopping Bag</h1>
        </div>
        <button className="btn btn-ghost btn-sm clear-bag-btn" onClick={clearCart}>
          <FiTrash2 size={13} /> Clear Bag
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* ── Cart Items List ──────────────────────────────────────── */}
        <div className="cart-items-column">
          <div className="card cart-items-card">
            <div className="cart-list-header">
              <span className="col-item">Piece</span>
              <span className="col-price">Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-total">Subtotal</span>
              <span className="col-remove"></span>
            </div>

            <div className="cart-items-stack">
              {cartItems.map((item) => {
                const lineTotal = item.price * item.quantity;
                const isMax = item.quantity >= item.stock;

                return (
                  <div key={item._id} className="cart-item-entry">
                    {/* Product Info */}
                    <div className="col-item item-meta-col">
                      <Link to={`/products/${item._id}`} className="item-thumb-box">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="item-thumb-img"
                        />
                      </Link>
                      <div>
                        <Link to={`/products/${item._id}`} className="item-title-link">
                          {item.name}
                        </Link>
                        <span className="item-dept-tag">{item.category}</span>
                        {item.stock <= 3 && (
                          <span className="item-stock-warning">Only {item.stock} left in archive</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-price item-unit-price">
                      ${Number(item.price).toFixed(2)}
                    </div>

                    {/* Quantity */}
                    <div className="col-qty">
                      <div className="item-qty-selector">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity - 1, item.stock)}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.stock)}
                          disabled={isMax}
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="col-total item-line-total">
                      ${lineTotal.toFixed(2)}
                    </div>

                    {/* Remove */}
                    <div className="col-remove">
                      <button
                        className="item-del-btn"
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cart-back-nav">
            <Link to="/products" className="continue-link">
              <FiArrowLeft size={15} /> Continue Exploring Collection
            </Link>
          </div>
        </div>

        {/* ── Summary Column ───────────────────────────────────────── */}
        <div className="cart-summary-column">
          <div className="card cart-summary-panel">
            <h3 className="summary-card-title">Order Summary</h3>

            <div className="summary-price-lines">
              <div className="price-line">
                <span>Items Subtotal</span>
                <span className="val">${cartSubTotal.toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Calculated Tax (15%)</span>
                <span className="val">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Direct Courier Shipping</span>
                <span className="val free-tag">COMPLIMENTARY</span>
              </div>

              <div className="summary-hr" />

              <div className="price-line grand-total-line">
                <span>Estimated Total</span>
                <span className="grand-val">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg checkout-trigger-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FiArrowRight size={16} />
            </button>

            <div className="checkout-trust-badge">
              <FiShield size={15} />
              <span>Encrypted 256-bit checkout session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
