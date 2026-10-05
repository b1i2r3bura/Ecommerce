/**
 * AdminProductEditPage.jsx — Product Creation & File-based Image Upload
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUploadCloud, FiCheck, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';
import './Admin.css';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/api/products/${id}`);
          const p = res.data;
          setName(p.name || '');
          setCategory(p.category || 'Electronics');
          setPrice(p.price !== undefined ? String(p.price) : '');
          setStock(p.stock !== undefined ? String(p.stock) : '');
          setImage(p.image || '');
          setDescription(p.description || '');
        } catch (err) {
          console.error('Failed to load product:', err);
          toast.error('Failed to load product');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditing, navigate]);

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB) and type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be under 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setSelectedFileName(file.name);

      const formData = new FormData();
      formData.append('image', file);

      // Call backend multer route
      const res = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImage(res.data.imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload image file';
      toast.error(errorMsg);
      setSelectedFileName('');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !category.trim() || price === '' || stock === '' || !image || !description.trim()) {
      toast.error('Please fill in all required fields and upload an image');
      return;
    }

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock, 10);

    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Price must be a positive number');
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      toast.error('Stock must be a non-negative integer');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        category: category.trim(),
        price: numericPrice,
        stock: numericStock,
        image: image.trim(),
        description: description.trim(),
      };

      if (isEditing) {
        await api.put(`/api/products/${id}`, payload);
        toast.success('Product updated in archive');
      } else {
        await api.post('/api/products', payload);
        toast.success('New product published to catalog');
      }

      navigate('/admin/products');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Operation failed';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container admin-page animate-fade-in" style={{ padding: 'var(--space-16) 0' }}>
        <p>Loading piece details...</p>
      </div>
    );
  }

  return (
    <div className="admin-page container animate-fade-in">
      <div className="admin-header-row">
        <div>
          <Link to="/admin/products" className="back-link" style={{ marginBottom: 'var(--space-2)', display: 'inline-flex' }}>
            <FiArrowLeft size={20} /> 
          </Link> 
          <span style={{ marginLeft: 'var(--space-2)' }} className="editorial-label">Inventory Management</span>
          <h1 className="admin-title">
            {isEditing ? `Edit Piece: ${name}` : 'Register New Archive Piece'}
          </h1>
        </div>
      </div>

      <div className="product-form-layout-grid">
        {/* ── Left: Form ───────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="card admin-form-card">
          <div className="form-grid-2">
            <div className="form-group form-col-span-2">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="input"
                required
                placeholder="e.g. AeroPro Wireless Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Category *</label>
              <input
                type="text"
                className="input"
                required
                placeholder="e.g. Electronics, Audio, Desk Accessories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input"
                required
                placeholder="299.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group form-col-span-2">
              <label className="form-label">Inventory Count in Stock *</label>
              <input
                type="number"
                min="0"
                step="1"
                className="input"
                required
                placeholder="25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* ── File Upload Section ─────────────────────────────── */}
            <div className="form-group form-col-span-2">
              <label className="form-label">Product Photography (File Upload Required) *</label>

              <div
                className="file-upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/avif"
                  onChange={handleFileUpload}
                />

                {uploadingImage ? (
                  <div className="upload-progress-state">
                    <p>Uploading image to studio server...</p>
                  </div>
                ) : image ? (
                  <div className="upload-success-state">
                    <FiCheck size={22} className="upload-check" />
                    <div>
                      <span className="upload-filename">{selectedFileName || 'Image uploaded'}</span>
                      <span className="upload-change-prompt">Click to select a different image file</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-idle-state">
                    <FiUploadCloud size={32} className="upload-cloud-icon" />
                    <div>
                      <span className="upload-main-text">Click to choose an image file from your computer</span>
                      <span className="upload-sub-text">Supports JPG, PNG, WebP, AVIF up to 5MB</span>
                    </div>
                  </div>
                )}
              </div>

              {image && (
                <div className="uploaded-url-indicator">
                  <span>Server Path: <code>{image}</code></span>
                </div>
              )}
            </div>

            <div className="form-group form-col-span-2">
              <label className="form-label">Product Description & Specs *</label>
              <textarea
                className="input"
                rows={5}
                required
                placeholder="Detailed craftsmanship notes, audio calibrations, materials..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting || uploadingImage}
            >
              {submitting ? 'Saving Piece...' : <><FiSave size={16} /> {isEditing ? 'Save Changes' : 'Publish Piece'}</>}
            </button>
            <Link to="/admin/products" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
          </div>
        </form>

        {/* ── Right: Live Card Preview ─────────────────────────────── */}
        <div className="product-live-preview-col">
          <div className="card live-preview-box">
            <h4 className="preview-label-head">Live Catalog Preview</h4>

            <div className="preview-img-frame">
              {image ? (
                <img
                  src={getImageUrl(image)}
                  alt={name || 'Preview'}
                  className="preview-real-img"
                />
              ) : (
                <div className="empty-preview-placeholder">
                  <FiImage size={34} />
                  <span>Upload a file to preview</span>
                </div>
              )}
            </div>

            <div className="preview-meta-panel">
              <span className="badge badge-secondary">{category || 'Category'}</span>
              <h3 className="preview-title-text">{name || 'Piece Title'}</h3>
              <p className="preview-price-text">${price ? Number(price).toFixed(2) : '0.00'}</p>
              <span className="preview-stock-note">
                Stock: {stock !== '' ? `${stock} units` : '0 units'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEditPage;
