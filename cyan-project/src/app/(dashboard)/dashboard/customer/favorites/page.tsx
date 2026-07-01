'use client';

import React from 'react';
import { Heart, Building2, MapPin } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RestaurantCard } from '@/components/RestaurantCard';

export default function CustomerFavorites() {
  const { restaurants, favorites } = useAppState();
  
  // Query actual bookmarked favorites
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));

  return (
    <DashboardLayout role="customer">
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Favorite Venues
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Quickly monitor availability and book tables at your top-rated dining spots.
          </p>
        </div>

        {favoriteRestaurants.length === 0 ? (
          <div className="py-20 border border-neutral-900 border-dashed rounded-3xl text-center text-neutral-500 text-xs">
            <Heart size={32} className="mx-auto text-neutral-700 mb-4" />
            <p className="font-semibold text-neutral-400 mb-1">No Favorites Bookmarked</p>
            <p className="text-neutral-550">Click the heart badges in listing summaries to save venues here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {favoriteRestaurants.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
