/**
 * ProtectedRoute.jsx — Route guard for authenticated users.
 *
 * WHAT IT DOES:
 *   Wraps a route component and checks if the user is logged in.
 *   If not logged in → redirect to /login (preserving the intended URL as state).
 *   If logged in → render the protected component normally.
 *
 * WHY THE STATE REDIRECT?
 *   When a guest tries to checkout, we redirect to /login?redirect=checkout.
 *   After login, the LoginPage reads this redirect and sends the user back
 *   to complete their purchase without losing their cart.
 */

import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
