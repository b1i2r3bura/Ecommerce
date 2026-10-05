/**
 * CartContext.jsx — Shopping Cart State Management
 *
 * WHAT IT DOES:
 *   React Context that manages the shopping cart for all users (including guests).
 *   Persists in localStorage.
 *   Enforces stock limits strictly.
 *   Prevents duplicate toast notifications by keeping side effects outside state reducers.
 */

import { createContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToCart = useCallback((product, qty = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      let newItems;

      if (existingItem) {
        const newQty = existingItem.quantity + qty;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} units available in stock`);
          return prevItems;
        }
        newItems = prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (qty > product.stock) {
          toast.error(`Only ${product.stock} units available in stock`);
          return prevItems;
        }
        newItems = [...prevItems, { ...product, quantity: qty }];
      }

      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });

    // Toast triggered once per user interaction
    toast.success(`${product.name} added to cart`, { id: `cart-${product._id}` });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item._id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId, newQty, stock) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > stock) {
      toast.error(`Only ${stock} units available in stock`, { id: 'stock-limit' });
      return;
    }

    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: newQty } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartSubTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
