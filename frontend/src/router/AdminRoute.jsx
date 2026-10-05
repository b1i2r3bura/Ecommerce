/**
 * AdminRoute.jsx — Route guard for admin users.
 *
 * Checks both:
 *   1. Is the user logged in? (authentication)
 *   2. Does the user have the 'admin' role? (authorization)
 *
 * Non-admin users are redirected to the homepage.
 *
 * IMPORTANT: This is ONLY a UX guard — it prevents the admin panel from
 * rendering for non-admins. The REAL security is enforced on the backend
 * by the adminOnly middleware. Never rely on frontend guards alone.
 */

import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
