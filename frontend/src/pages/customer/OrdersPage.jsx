/**
 * OrdersPage.jsx — Customer Order History
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiArrowRight, FiCalendar } from 'react-icons/fi';
import api from '../../api/axios';
import EmptyState from '../../components/ui/EmptyState';
import { getImageUrl } from '../../utils/imageHelper';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/orders/myorders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'badge-success';
      case 'shipped':
        return 'badge-accent';
      case 'processing':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="orders-page container animate-fade-in">
      <div className="orders-header-row">
        <div>
          <span className="editorial-label">Account Activity</span>
          <h1 className="orders-title">Order History</h1>
          <p className="orders-subtitle">Review archive receipts and live delivery status</p>
        </div>
      </div>

      {loading ? (
        <div className="orders-loading-box">
          <p>Retrieving order history...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-stack">
          {orders.map((order) => {
            const totalItemsCount = order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

            return (
              <div key={order._id} className="card order-entry-card">
                <div className="order-entry-header">
                  <div className="order-meta-cells">
                    <div className="order-meta-cell">
                      <span className="meta-label">Order Reference</span>
                      <span className="meta-val font-serif">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                    </div>
                    <div className="order-meta-cell">
                      <span className="meta-label">Date Placed</span>
                      <span className="meta-val">
                        <FiCalendar size={13} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="order-status-actions">
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                      View Receipt <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Items snapshot */}
                <div className="order-items-strip">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-thumb-item">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="order-thumb-img"
                      />
                      <div>
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">Qty: {item.quantity} • ${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-entry-footer">
                  <span className="total-items-note">
                    {totalItemsCount} {totalItemsCount === 1 ? 'piece' : 'pieces'} ordered
                  </span>
                  <div className="order-total-block">
                    <span className="total-label">Total Paid:</span>
                    <span className="order-total-val">${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FiPackage}
          title="No Orders Placed Yet"
          description="You haven't made any purchases yet. Head over to our catalog and discover exciting new gear!"
          actionLabel="Explore Catalog"
          actionLink="/products"
        />
      )}
    </div>
  );
};

export default OrdersPage;
