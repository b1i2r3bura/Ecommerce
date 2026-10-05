import { Link } from 'react-router-dom';
import { FiPlus, FiCheck } from 'react-icons/fi';
import StarRating from '../ui/StarRating';
import useCart from '../../hooks/useCart';
import { getImageUrl } from '../../utils/imageHelper';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  const itemInCart = cartItems.find((item) => item._id === product._id);
  const currentCartQty = itemInCart ? itemInCart.quantity : 0;
  const isOutOfStock = product.stock <= 0 || !product.inStock;
  const isMaxInCart = currentCartQty >= product.stock;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isMaxInCart) return;
    addToCart(product, 1);
  };

  return (
    <article className="card product-card animate-fade-in">
      {/* ── Image & Tag ────────────────────────────────────────────── */}
      <Link to={`/products/${product._id}`} className="product-card-img-link">
        <div className="product-card-img-wrapper">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </div>

        <div className="product-card-badges">
          <span className="badge badge-secondary">{product.category}</span>
          {isOutOfStock ? (
            <span className="badge badge-error">Sold Out</span>
          ) : product.stock <= 3 ? (
            <span className="badge badge-warning">Only {product.stock} Left</span>
          ) : null}
        </div>
      </Link>

      {/* ── Card Content ───────────────────────────────────────────── */}
      <div className="product-card-body">
        <div className="product-card-meta">
          <StarRating
            rating={product.averageRating || 0}
            numOfReviews={product.numOfReviews || 0}
            size={13}
          />
        </div>

        <Link to={`/products/${product._id}`} className="product-card-title-link">
          <h3 className="product-card-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <p className="product-card-desc">
          {product.description?.length > 75
            ? `${product.description.substring(0, 75)}...`
            : product.description}
        </p>

        {/* ── Price & Add to Cart ───────────────────────────────────── */}
        <div className="product-card-footer">
          <div className="product-price-block">
            <span className="currency">$</span>
            <span className="amount">{Number(product.price).toFixed(2)}</span>
          </div>

          <button
            className={`btn btn-sm ${
              isOutOfStock
                ? 'btn-disabled'
                : isMaxInCart
                ? 'btn-secondary'
                : 'btn-primary'
            } product-add-btn`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxInCart}
            aria-label={`Add ${product.name} to cart`}
          >
            {isOutOfStock ? (
              'Sold Out'
            ) : isMaxInCart ? (
              <>
                <FiCheck size={13} /> In Cart ({currentCartQty})
              </>
            ) : (
              <>
                <FiPlus size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
