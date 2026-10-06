/**
 * imageHelper.js — Resolves image URLs
 *
 * If an image path is relative (e.g., starts with `/uploads/`), prepends the backend server base URL.
 * If it's already an external absolute URL (Unsplash, HTTPS), leaves it intact.
 */

const getBaseHost = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80';
  }

  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${getBaseHost()}${cleanPath}`;
  }

  return imagePath;
};
