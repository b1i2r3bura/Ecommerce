/**
 * AdminUsersPage.jsx — User Directory
 */

import { useState, useEffect } from 'react';
import { FiTrash2, FiShield, FiUser, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import './Admin.css';

const AdminUsersPage = () => {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (userId === userInfo?._id) {
      toast.error('You cannot delete your own active administrator account');
      return;
    }

    if (!window.confirm(`Permanently remove user account for "${userName}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/users/${userId}`);
      toast.success('User account removed');
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      toast.error(errorMsg);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header-row">
        <div>
          <span className="editorial-label">Patron Directory</span>
          <h1 className="admin-title">Registered Accounts</h1>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="admin-toolbar card">
        <div className="admin-search-box">
          <FiSearch size={16} className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="admin-items-count">
          {filteredUsers.length} accounts registered
        </span>
      </div>

      {/* ── Users Table ────────────────────────────────────────────── */}
      <div className="card admin-table-card">
        {loading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p>Loading accounts...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>System Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = u._id === userInfo?._id;

                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="table-user-item">
                          <div className="user-avatar-initial-sm">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="table-user-name">
                              {u.name} {isCurrentAdmin && <span className="you-tag">(You)</span>}
                            </span>
                            <span className="table-user-id">ID: {u._id.substring(u._id.length - 6)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-secondary'}`}>
                          {u.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
                          <span style={{ marginLeft: '4px', textTransform: 'capitalize' }}>{u.role}</span>
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {!isCurrentAdmin && (
                          <button
                            className="btn btn-ghost btn-sm action-icon-btn delete-btn"
                            onClick={() => handleDeleteUser(u._id, u.name)}
                            title="Delete User"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No users found matching your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
