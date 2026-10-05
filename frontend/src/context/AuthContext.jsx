/**
 * AuthContext.jsx — Global Authentication State
 *
 * WHAT IT IS:
 *   React Context that manages the currently logged-in user across the
 *   entire application. Any component can access auth state without prop drilling.
 *
 * WHY WE NEED IT:
 *   The Navbar needs to know if someone is logged in (to show "Logout" vs "Login").
 *   Protected routes need to know the user's role.
 *   API calls need the JWT token.
 *   Without Context, we'd have to pass this data through every component.
 *
 * HOW IT WORKS:
 *   - `userInfo` holds the logged-in user object (name, email, role, token).
 *   - It's initialized from localStorage so the user stays logged in on page refresh.
 *   - `login()` saves the user to state AND localStorage.
 *   - `logout()` clears both.
 *   - `useAuth()` hook (in hooks/useAuth.js) is the easy way to consume this context.
 */

import { createContext, useState } from 'react';

// Create the context object — this is what we export and consume in components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage (persists across page refreshes)
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  /** 
   * login — Called after successful API login or register.
   * Saves the full user object (including JWT token) to state and localStorage.
   */
  const login = (userData) => {
    setUserInfo(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  /**
   * logout — Clears the user from state and localStorage.
   * The Axios interceptor will stop sending the token after this.
   */
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  const value = {
    userInfo,         // The full user object (or null if not logged in)
    login,            // Call after successful login/register
    logout,           // Call when the user clicks "Logout"
    isAuthenticated: !!userInfo,          // Boolean: is anyone logged in?
    isAdmin: userInfo?.role === 'admin',  // Boolean: is the user an admin?
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
