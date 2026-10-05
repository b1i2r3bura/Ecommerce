/**
 * ProductsPage.jsx — Clean Architectural Product Catalog
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiX, FiRefreshCw } from 'react-icons/fi';
import api from '../../api/axios';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/SkeletonLoader';
import EmptyState from '../../components/ui/EmptyState';
import './ProductsPage.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryString = searchParams.toString();
      const res = await api.get(`/api/products${queryString ? `?${queryString}` : ''}`);
      setProducts(res.data.products || []);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = currentSearch || (currentCategory && currentCategory !== 'all') || currentSort;

  return (
    <div className="products-page container animate-fade-in">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="catalog-header-bar">
        <div>
          <span className="editorial-label">Archive Catalog</span>
          <h1 className="catalog-heading">Curated Collection</h1>
          <p className="catalog-count-note">
            {loading ? 'Consulting archive...' : `Displaying ${products.length} crafted ${products.length === 1 ? 'piece' : 'pieces'}`}
          </p>
        </div>

        {/* ── Search & Sort ───────────────────────────────────────── */}
        <div className="catalog-filter-controls">
          <form className="catalog-search-form" onSubmit={handleSearchSubmit}>
           
            <input
              type="text"
              className="input search-input"
              placeholder="Search goods by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
           {/*   <FiSearch className="search-icon" size={16} /> */}
            {searchInput && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                aria-label="Clear search"
              >
                <FiX size={15} />
              </button>
            )}
          </form>

          <select
            className="input sort-select"
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            aria-label="Sort Collection"
          >
            <option value="">Sort: Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* ── Category Pill Tabs ────────────────────────────────────── */}
      <div className="category-pills-row">
        <button
          className={`cat-pill ${currentCategory === 'all' || !currentCategory ? 'active' : ''}`}
          onClick={() => updateParam('category', 'all')}
        >
          All Goods
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${currentCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
            onClick={() => updateParam('category', cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Active Filters ────────────────────────────────────────── */}
      {hasActiveFilters && (
        <div className="active-filters-strip">
          <span className="filter-strip-label">Applied Filters:</span>
          {currentSearch && (
            <span className="badge badge-secondary filter-badge">
              Keyword: "{currentSearch}"
              <FiX className="badge-x" onClick={() => updateParam('search', '')} />
            </span>
          )}
          {currentCategory && currentCategory !== 'all' && (
            <span className="badge badge-secondary filter-badge">
              Department: {currentCategory}
              <FiX className="badge-x" onClick={() => updateParam('category', 'all')} />
            </span>
          )}
          {currentSort && (
            <span className="badge badge-secondary filter-badge">
              Sorted
              <FiX className="badge-x" onClick={() => updateParam('sort', '')} />
            </span>
          )}
          <button className="btn btn-ghost btn-sm reset-all-btn" onClick={handleClearFilters}>
            <FiRefreshCw size={12} /> Reset Filters
          </button>
        </div>
      )}

      {/* ── Product Grid ──────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-4 products-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-4 products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No pieces match your search"
          description="We couldn't find items matching your specified parameters. Try clearing filters or checking other departments."
          actionLabel="Reset All Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
};

export default ProductsPage;
