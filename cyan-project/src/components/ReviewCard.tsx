import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/types';
import { Card } from './Card';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card variant="glass" className="p-5 border-neutral-800/60 bg-neutral-950/20">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-850 shrink-0 border border-neutral-800">
          <img
            src={review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={review.userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Review Details */}
        <div className="flex-grow">
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <h5 className="font-semibold text-sm text-white">{review.userName}</h5>
            <span className="text-xs text-neutral-500">{review.date}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < review.rating ? 'text-amber-400' : 'text-neutral-700'}
                fill={i < review.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed font-sans font-light">
            "{review.comment}"
          </p>
        </div>
      </div>
    </Card>
  );
};
