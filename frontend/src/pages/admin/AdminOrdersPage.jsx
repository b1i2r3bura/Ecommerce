/**
 * AdminOrdersPage.jsx — Order Fulfillment & Status Management
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import './Admin.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to "${newStatus}"`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update order status';
      toast.error(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.name && o.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (o.user?.email && o.user.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header-row">
        <div>
          <span className="editorial-label">Fulfillment Workspace</span>
          <h1 className="admin-title">Customer Orders Management</h1>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="admin-toolbar card">
        <div className="admin-search-box">
          <FiSearch size={16} className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search by Order ID or customer email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <select
            className="input sort-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <span className="admin-items-count">
            {filteredOrders.length} orders
          </span>
        </div>
      </div>

      {/* ── Orders Table ───────────────────────────────────────────── */}
      <div className="card admin-table-card">
        {loading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p>Loading customer orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items Snapshot</th>
                  <th>Total Paid</th>
                  <th>Fulfillment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-mono">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td>
                      <div className="table-user-info">
                        <span className="table-user-name">{order.user?.name || 'Customer'}</span>
                        <span className="table-user-email">{order.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="table-items-summary">
                        {order.items?.length} items ({order.items?.reduce((a, b) => a + b.quantity, 0)} units)
                      </span>
                    </td>
                    <td className="table-price">${Number(order.totalAmount).toFixed(2)}</td>
                    <td>
                      <select
                        className={`status-select ${order.status}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn btn-ghost btn-sm action-icon-btn"
                        title="View Full Receipt"
                      >
                        <FiEye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No orders match your filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
