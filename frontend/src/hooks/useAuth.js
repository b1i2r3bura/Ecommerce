/**
 * useAuth.js — Auth Context Hook
 *
 * A thin convenience wrapper so components don't need to import both
 * useContext and AuthContext. Usage:
 *   const { userInfo, login, logout, isAdmin } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};

export default useAuth;
