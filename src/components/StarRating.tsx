
import React from 'react';
import { Icons } from './icons';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating, size = 'md', className='' }) => {
  const starSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!setRating}
          onClick={() => setRating?.(star)}
          className={`text-yellow-400 transition-colors ${setRating ? 'cursor-pointer hover:text-yellow-500' : 'cursor-default'}`}
          aria-label={`Rate ${star} stars`}
        >
          <Icons.Star
            className={`${starSizeClasses[size]} ${rating >= star ? 'fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
