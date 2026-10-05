/**
 * imageHelper.js — Resolves image URLs
 *
 * If an image path is relative (e.g., starts with `/uploads/`), prepends the backend server base URL.
 * If it's already an external absolute URL (Unsplash, HTTPS), leaves it intact.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
  }

  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE}${cleanPath}`;
  }

  return imagePath;
};
