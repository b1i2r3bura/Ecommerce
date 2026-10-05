/**
 * OrderDetailPage.jsx — Itemized Order Receipt & Timeline
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        toast.error('Order not found or access denied');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container order-detail-page animate-fade-in" style={{ padding: 'var(--space-16) 0' }}>
        <p>Loading order receipt...</p>
      </div>
    );
  }

  if (!order) return null;

  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="order-detail-page container animate-fade-in">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="receipt-header-row">
        <Link to="/orders" className="back-link">
          <FiArrowLeft size={15} /> Back to Order History
        </Link>
        <div className="receipt-title-block">
          <div>
            <span className="editorial-label">Official Receipt</span>
            <h1 className="receipt-title">
              Order #{order._id.substring(order._id.length - 8).toUpperCase()}
            </h1>
          </div>
          <span className="receipt-timestamp">
            <FiCalendar size={14} /> {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* ── Status Timeline ───────────────────────────────────────── */}
      <div className="card tracker-card">
        <h3 className="tracker-card-title">Fulfillment Progress</h3>
        <div className="tracker-timeline-grid">
          {statuses.map((step, idx) => {
            const isCompleted = currentStatusIndex >= idx;
            const isCurrent = currentStatusIndex === idx;

            return (
              <div
                key={step}
                className={`tracker-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="node-indicator">
                  {isCompleted ? <FiCheckCircle size={15} /> : idx + 1}
                </div>
                <span className="node-label">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="receipt-grid-layout">
        {/* ── Items Column ─────────────────────────────────────────── */}
        <div className="receipt-items-column">
          <div className="card receipt-card">
            <h3 className="receipt-sec-heading">Purchased Items ({order.items?.length})</h3>

            <div className="receipt-items-stack">
              {order.items?.map((item, idx) => (
                <div key={idx} className="receipt-item-line">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="receipt-item-thumb"
                  />
                  <div className="receipt-item-details">
                    <span className="receipt-item-name">{item.name}</span>
                    <span className="receipt-item-calc">
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="receipt-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Financial Breakdown ──────────────────────────────────── */}
        <div className="receipt-summary-column">
          <div className="card receipt-summary-card">
            <h3 className="receipt-sec-heading">Payment Record</h3>

            <div className="summary-price-lines">
              <div className="price-line">
                <span>Items Subtotal</span>
                <span>${Number(order.subTotal).toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Calculated Tax (15%)</span>
                <span>${Number(order.taxAmount).toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Courier Delivery</span>
                <span className="free-tag">COMPLIMENTARY</span>
              </div>

              <div className="summary-hr" />

              <div className="price-line grand-total-line">
                <span>Total Amount Paid</span>
                <span className="grand-val">${Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>

            <div className="receipt-verified-badge">
              <FiCheckCircle size={15} style={{ color: 'var(--color-success)' }} />
              <span>Payment authorized & historical catalog price frozen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
