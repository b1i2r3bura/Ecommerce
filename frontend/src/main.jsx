/**
 * main.jsx — Frontend Application Bootstrap
 *
 * WHAT IT DOES:
 *   1. Mounts React 19 to #root container in index.html.
 *   2. Provides BrowserRouter for client-side routing.
 *   3. Wraps with AuthProvider (global login/user state).
 *   4. Wraps with CartProvider (global shopping cart & inventory limits).
 *   5. Injects Toaster notifications with custom dark-mode styling.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#161d2f',
                color: '#f0f4ff',
                border: '1px solid #2a3550',
                borderRadius: '0.625rem',
                fontSize: '0.9rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#161d2f',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#161d2f',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
