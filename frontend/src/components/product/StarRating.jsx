/* StarRating component */
import { FiStar } from 'react-icons/fi';

/**
 * StarRating — Renders 5 stars filled to the given rating.
 *
 * @param {number} rating     - Average rating (0–5, supports decimals)
 * @param {number} numReviews - Number of reviews (shown next to stars)
 * @param {boolean} showCount - Whether to show the review count
 * @param {string}  size      - 'sm' | 'md' | 'lg'
 */
const StarRating = ({ rating = 0, numReviews = 0, showCount = true, size = 'sm' }) => {
  const sizes = { sm: 13, md: 16, lg: 20 };
  const starSize = sizes[size] || 13;

  return (
    <div className="stars-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= Math.round(rating) ? 'var(--color-amber)' : 'var(--color-text-muted)',
              fontSize: starSize,
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
      </div>
      {showCount && (
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
          {rating > 0 ? rating.toFixed(1) : '0.0'}
          {numReviews > 0 && ` (${numReviews})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
