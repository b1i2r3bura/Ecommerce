/**
 * ProfilePage.jsx — Customer Account Profile
 */

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiShield, FiSave, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userInfo, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsUpdating(true);
      const updateData = { name, email };
      if (password) {
        updateData.password = password;
      }

      const res = await api.put('/api/users/profile', updateData);

      login({
        ...userInfo,
        name: res.data.name,
        email: res.data.email,
      });

      toast.success('Account profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="profile-page container animate-fade-in">
      <div className="profile-header-row">
        <div>
          <span className="editorial-label">Account Preferences</span>
          <h1 className="profile-title">Profile Settings</h1>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* ── Left: Profile Card Overview ─────────────────────────── */}
        <div className="profile-sidebar-col">
          <div className="card profile-card-box">
            <div className="profile-avatar-initial">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>

            <h3 className="profile-name-text">{name}</h3>
            <p className="profile-email-text">{email}</p>

            <span className="badge badge-secondary profile-role-badge">
              <FiShield size={12} /> {userInfo?.role}
            </span>

            <div className="profile-meta-list">
              <div className="meta-row">
                <FiCheckCircle size={15} className="check-icon" />
                <span>Verified Account</span>
              </div>
              <div className="meta-row">
                <FiLock size={15} className="check-icon" />
                <span>Protected JWT Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Form ─────────────────────────────────────────── */}
        <div className="profile-form-col">
          <div className="card profile-form-card">
            <h3 className="form-card-heading">Edit Personal Information</h3>

            <form onSubmit={handleSubmit} className="profile-edit-form">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-divider-hr" />
              <h4 className="password-subheading">Change Security Password (Optional)</h4>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Leave blank to keep current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-md profile-save-btn"
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving Profile...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
