/**
 * StarRating.jsx — 5-star rating display & interactive selector
 *
 * WHAT IT DOES:
 *   - Renders 5 stars (filled, half-filled, or empty) based on a rating value.
 *   - Can be used purely as a DISPLAY component (e.g. on product cards and reviews)
 *   - Can be used as an INTERACTIVE selector (e.g. when leaving a review).
*/
import { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({
  rating = 0,
  numOfReviews,
  interactive = false,
  onRatingChange,
  size = 16,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`star-rating-container ${interactive ? 'interactive' : ''}`}>
      <div className="stars-wrapper" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFull = displayRating >= starIndex;
          const isHalf = !isFull && displayRating >= starIndex - 0.5;

          return (
            <span
              key={starIndex}
              className={`star-icon-btn ${interactive ? 'clickable' : ''}`}
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              role={interactive ? 'button' : 'img'}
              aria-label={`${starIndex} star`}
              tabIndex={interactive ? 0 : -1}
            >
              {isFull ? (
                <FaStar size={size} className="star-filled" />
              ) : isHalf ? (
                <FaStarHalfAlt size={size} className="star-half" />
              ) : (
                <FaRegStar size={size} className="star-empty" />
              )}
            </span>
          );
        })}
      </div>

      {/* Numeric score & review count (for display mode) */}
      {!interactive && (
        <div className="rating-info">
          {rating > 0 && <span className="rating-score">{Number(rating).toFixed(1)}</span>}
          {numOfReviews !== undefined && (
            <span className="rating-count">({numOfReviews})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
