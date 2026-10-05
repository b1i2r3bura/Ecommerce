/**
 * AdminContactsPage.jsx — Admin Customer Inquiries Inbox
 */

import { useState, useEffect } from 'react';
import { FiMail, FiTrash2, FiCheckCircle, FiSearch, FiClock, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import './Admin.css';

const AdminContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/contact');
      setContacts(res.data || []);
    } catch (err) {
      console.error('Failed to load contact submissions:', err);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/api/contact/${id}/status`, { status: newStatus });
      toast.success(`Inquiry marked as ${newStatus}`);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact inquiry?')) return;

    try {
      await api.delete(`/api/contact/${id}`);
      toast.success('Inquiry deleted');
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Customer Support & Inquiries Inbox</h1>
          <p className="admin-subtitle">Messages submitted via the public contact form</p>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="admin-toolbar card">
        <div className="admin-search-box">
          <FiSearch size={16} className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search by sender name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="admin-items-count">
          {filteredContacts.length} inquiries ({contacts.filter((c) => c.status === 'unread').length} unread)
        </span>
      </div>

      {/* ── Inquiries List ─────────────────────────────────────────── */}
      <div className="admin-inbox-list">
        {loading ? (
          <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p>Loading inquiries...</p>
          </div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((item) => (
            <div key={item._id} className={`card admin-inquiry-card ${item.status === 'unread' ? 'unread-border' : ''}`}>
              <div className="inquiry-top">
                <div className="inquiry-sender-meta">
                  <div className="sender-avatar">
                    {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="sender-name">{item.name}</h4>
                    <a href={`mailto:${item.email}`} className="sender-email link">
                      {item.email}
                    </a>
                  </div>
                </div>

                <div className="inquiry-actions-meta">
                  <span className="inquiry-date">
                    <FiClock size={13} /> {new Date(item.createdAt).toLocaleString()}
                  </span>

                  <select
                    className={`status-select ${item.status}`}
                    value={item.status}
                    onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>

                  <button
                    className="btn btn-ghost btn-sm delete-btn"
                    onClick={() => handleDelete(item._id)}
                    title="Delete Message"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="inquiry-content">
                <h5 className="inquiry-subject">Subject: {item.subject}</h5>
                <p className="inquiry-message">{item.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No customer inquiries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactsPage;
