/**
 * AdminDashboard.jsx — Studio Operations Overview
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiArrowRight,
  FiAlertTriangle,
  FiPlus,
  FiMail,
} from 'react-icons/fi';
import api from '../../api/axios';
import './Admin.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prodRes, orderRes, userRes, contactRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/orders'),
          api.get('/api/users'),
          api.get('/api/contact').catch(() => ({ data: [] })),
        ]);

        setProducts(prodRes.data.products || []);
        setOrders(orderRes.data || []);
        setUsers(userRes.data || []);
        setContacts(contactRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const unreadContacts = contacts.filter((c) => c.status === 'unread');

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header-row">
        <div>
          <span className="editorial-label">Executive Control</span>
          <h1 className="admin-title">Studio Operations Workspace</h1>
        </div>

        <div className="admin-quick-actions">
          <Link to="/admin/products/new" className="btn btn-primary btn-md">
            <FiPlus size={15} /> Add New Piece
          </Link>
          <Link to="/admin/contacts" className="btn btn-secondary btn-md">
            <FiMail size={15} /> Inquiries ({unreadContacts.length})
          </Link>
        </div>
      </div>

      {/* ── Metric Summary Tiles ──────────────────────────────────── */}
      <div className="grid grid-4 metrics-grid">
        <div className="card metric-card">
          <div className="metric-icon-box">
            <FiDollarSign size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Gross Revenue</span>
            <span className="metric-val">{loading ? '...' : `$${totalRevenue.toFixed(2)}`}</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box">
            <FiShoppingBag size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Fulfilled & Pending Orders</span>
            <span className="metric-val">{loading ? '...' : orders.length}</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box">
            <FiPackage size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Active Catalog Pieces</span>
            <span className="metric-val">{loading ? '...' : products.length}</span>
          </div>
        </div>

        <div className="card metric-card">
          <div className="metric-icon-box">
            <FiUsers size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Registered Patrons</span>
            <span className="metric-val">{loading ? '...' : users.length}</span>
          </div>
        </div>
      </div>

      {/* ── Operational Columns ────────────────────────────────────── */}
      <div className="dashboard-two-col">
        {/* Recent Orders */}
        <div className="card dashboard-section-card">
          <div className="section-card-head">
            <div>
              <h3>Recent Customer Orders</h3>
              <p>{pendingOrders.length} orders awaiting fulfillment dispatch</p>
            </div>
            <Link to="/admin/orders" className="btn btn-ghost btn-sm">
              All Orders <FiArrowRight size={14} />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="font-mono">
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      <td>{order.user?.name || 'Customer'}</td>
                      <td className="table-price">${Number(order.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'cancelled' ? 'badge-error' : 'badge-warning'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-table-note">No orders registered yet.</p>
          )}
        </div>

        {/* Low Inventory Warnings */}
        <div className="card dashboard-section-card">
          <div className="section-card-head">
            <div>
              <h3>Low Inventory Alerts</h3>
              <p>Items with 5 or fewer units remaining</p>
            </div>
            <Link to="/admin/products" className="btn btn-ghost btn-sm">
              Manage Catalog <FiArrowRight size={14} />
            </Link>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="low-stock-stack">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="low-stock-row">
                  <div className="low-stock-info">
                    <FiAlertTriangle size={16} className="warning-icon" />
                    <div>
                      <h4 className="low-stock-title">{p.name}</h4>
                      <span className="low-stock-dept">{p.category}</span>
                    </div>
                  </div>
                  <div className="low-stock-actions">
                    <span className={`badge ${p.stock === 0 ? 'badge-error' : 'badge-warning'}`}>
                      {p.stock === 0 ? 'Sold Out' : `${p.stock} Units`}
                    </span>
                    <Link to={`/admin/products/${p._id}/edit`} className="btn btn-secondary btn-sm">
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-table-note" style={{ color: 'var(--color-success)' }}>
              ✓ All catalog items have healthy stock levels.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
