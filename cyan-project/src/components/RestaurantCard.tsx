import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Utensils, DollarSign, Heart, Clock } from 'lucide-react';
import { Restaurant } from '@/types';
import { useAppState } from '@/services/appState';
import { Button } from './Button';

interface RestaurantCardProps {
  restaurant: Restaurant;
  className?: string;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, className = '' }) => {
  const { favorites, toggleFavorite, currentUser } = useAppState();
  const isFav = favorites.includes(restaurant.id);
  const showHeart = !currentUser || currentUser.role === 'customer';

  const priceLabel =
    restaurant.priceRange.length === 2
      ? 'Casual Dining'
      : restaurant.priceRange.length === 3
      ? 'Premium Dining'
      : 'Luxury Fine Dining';

  return (
    <div
      className={`group relative flex flex-col rounded-3xl overflow-hidden border border-neutral-900 bg-neutral-950/60 backdrop-blur-md shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-neutral-800/70 transition-all duration-500 hover:-translate-y-1.5 ${className}`}
    >
      {/* ── Image Section ── */}
      <div className="relative aspect-video overflow-hidden bg-neutral-900">
        {/* Main photo */}
        <img
          src={restaurant.image ?? '/placeholder.png'}
          alt={restaurant.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Cuisine badge – top left */}
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-neutral-950/75 backdrop-blur-md text-amber-400 border border-amber-500/20 rounded-full shadow-md">
          {restaurant.cuisine}
        </span>

        {/* Rating badge – top right */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold bg-amber-500 text-neutral-950 rounded-lg shadow-lg shadow-amber-500/20">
          <Star size={11} fill="currentColor" />
          <span>{restaurant.rating.toFixed(1)}</span>
        </div>

        {/* Heart / Favourite – bottom right */}
        {showHeart && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(restaurant.id);
            }}
            className={`absolute bottom-4 right-4 p-2 rounded-xl backdrop-blur-md border cursor-pointer transition-all duration-300 z-10 shadow-md ${
              isFav
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 scale-110'
                : 'bg-neutral-950/70 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900/90 hover:scale-110'
            }`}
            title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
          >
            <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Featured badge – bottom left (if applicable) */}
        {restaurant.featured && (
          <span className="absolute bottom-4 left-4 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 rounded-full shadow-lg">
            ★ Featured
          </span>
        )}
      </div>

      {/* ── Gallery strip – three thumbnail images ── */}
      {Array.isArray(restaurant.images) && restaurant.images.length > 1 && (
        <div className="flex gap-1.5 px-4 py-3 bg-neutral-950 border-b border-neutral-900">
          {restaurant.images.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              className="flex-1 aspect-video rounded-lg overflow-hidden border border-neutral-900 hover:border-amber-500/30 transition-colors cursor-pointer"
            >
              <img
                src={img}
                alt={`${restaurant.name} photo ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/placeholder.png';
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Card details ── */}
      <div className="flex flex-col flex-grow p-5 space-y-3">
        {/* Name */}
        <h3 className="text-base font-extrabold text-white font-sans tracking-tight group-hover:text-amber-400 transition-colors leading-tight">
          {restaurant.name}
        </h3>

        {/* Info rows */}
        <div className="flex flex-col gap-1.5 text-xs text-neutral-400 font-light">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-neutral-500 shrink-0" />
            <span className="truncate">{restaurant.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Utensils size={12} className="text-neutral-500 shrink-0" />
            <span className="capitalize">{restaurant.cuisine}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-neutral-500 shrink-0" />
            <span>{restaurant.openingHours}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-500/80 font-semibold">
            <DollarSign size={12} className="shrink-0" />
            <span>
              {restaurant.priceRange}{' '}
              <span className="text-[10px] text-neutral-500 font-normal">· {priceLabel}</span>
            </span>
          </div>
        </div>

        {/* Short description preview */}
        {restaurant.description && (
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* Footer action row */}
        <div className="mt-auto pt-4 border-t border-neutral-900/60 flex items-center justify-between">
          <span className="text-[10px] text-neutral-500 font-semibold">
            {restaurant.reviewCount} verified reviews
          </span>
          <Link href={`/restaurants/${restaurant.id}`} passHref>
            <Button
              variant="primary"
              size="sm"
              className="text-xs shadow-amber-500/5 group-hover:shadow-amber-500/20 transition-shadow"
            >
              Book Table
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
