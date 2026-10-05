/**
 * AdminProductsPage.jsx — Catalog Management & Review Moderation
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMessageSquare,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import StarRating from '../../components/ui/StarRating';
import { getImageUrl } from '../../utils/imageHelper';
import './Admin.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProductForReviews, setSelectedProductForReviews] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/products');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Permanently remove "${name}" from catalog archive?`)) {
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);
      toast.success('Product removed from catalog');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product';
      toast.error(errorMsg);
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm('Delete this customer review?')) return;

    try {
      await api.delete(`/api/products/${productId}/reviews/${reviewId}`);
      toast.success('Review removed');
      const updatedRes = await api.get(`/api/products/${productId}`);
      setSelectedProductForReviews(updatedRes.data);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header-row">
        <div>
          <span className="editorial-label">Archive Management</span>
          <h1 className="admin-title">Catalog Inventory</h1>
        </div>

        <Link to="/admin/products/new" className="btn btn-primary btn-md">
          <FiPlus size={15} /> Add New Piece
        </Link>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="admin-toolbar card">
        <div className="admin-search-box">
          <FiSearch size={16} className="search-icon" />
          <input
            type="text"
            className="input search-input"
            placeholder="Search piece by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="admin-items-count">
          {filteredProducts.length} pieces in inventory
        </span>
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <div className="card admin-table-card">
        {loading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p>Loading catalog pieces...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Piece</th>
                  <th>Department</th>
                  <th>Price</th>
                  <th>Stock Inventory</th>
                  <th>Customer Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="table-product-item">
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.name}
                          className="table-product-img"
                        />
                        <div>
                          <Link to={`/products/${p._id}`} className="table-product-name">
                            {p.name}
                          </Link>
                          <span className="table-product-id">ID: {p._id.substring(p._id.length - 6)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">{p.category}</span>
                    </td>
                    <td className="table-price">${Number(p.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.stock <= 0 ? 'badge-error' : p.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                        {p.stock} units {p.stock <= 0 ? '(Sold Out)' : ''}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <StarRating rating={p.averageRating || 0} size={13} />
                        <button
                          className="btn btn-ghost btn-sm review-count-btn"
                          onClick={() => setSelectedProductForReviews(p)}
                          title="Moderate Customer Reviews"
                        >
                          <FiMessageSquare size={12} /> {p.numOfReviews || 0}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="btn btn-ghost btn-sm action-icon-btn edit-btn"
                          title="Edit Product"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm action-icon-btn delete-btn"
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          title="Delete Product"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No items matched your search query.</p>
          </div>
        )}
      </div>

      {/* ── Review Moderation Modal ─────────────────────────────────── */}
      {selectedProductForReviews && (
        <div className="modal-overlay" onClick={() => setSelectedProductForReviews(null)}>
          <div className="card modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Reviews for {selectedProductForReviews.name}</h3>
                <p className="modal-sub">
                  Average Rating: {selectedProductForReviews.averageRating || 0}★ ({selectedProductForReviews.numOfReviews || 0} customer reviews)
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm modal-close-btn"
                onClick={() => setSelectedProductForReviews(null)}
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="modal-body">
              {selectedProductForReviews.reviews && selectedProductForReviews.reviews.length > 0 ? (
                <div className="modal-reviews-list">
                  {selectedProductForReviews.reviews.map((rev) => (
                    <div key={rev._id} className="modal-review-item">
                      <div className="modal-review-top">
                        <div>
                          <strong>{rev.name}</strong> • <StarRating rating={rev.rating} size={12} />
                        </div>
                        <button
                          className="btn btn-ghost btn-sm delete-review-btn"
                          onClick={() => handleDeleteReview(selectedProductForReviews._id, rev._id)}
                        >
                          <FiTrash2 size={13} /> Delete Review
                        </button>
                      </div>
                      {rev.comment && <p className="modal-review-comment">{rev.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
                  No customer reviews submitted yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
