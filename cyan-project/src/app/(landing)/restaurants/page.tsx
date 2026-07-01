'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MapPin, Star, SlidersHorizontal, DollarSign } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { RestaurantCard } from '@/components/RestaurantCard';

function RestaurantListContent() {
  const searchParams = useSearchParams();
  const { restaurants } = useAppState();

  // Search input values
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [minRating, setMinRating] = useState('0');

  // Pre-fill filter state from query parameters if present
  useEffect(() => {
    const locParam = searchParams.get('location');
    const cuisineParam = searchParams.get('cuisine');

    if (locParam) {
      // Check if it matches a known location or name search
      const lowerLoc = locParam.toLowerCase();
      if (lowerLoc.includes('manhattan') || lowerLoc.includes('new york')) {
        setSelectedLocation('Manhattan, New York');
      } else if (lowerLoc.includes('los angeles')) {
        setSelectedLocation('Downtown, Los Angeles');
      } else if (lowerLoc.includes('boston')) {
        setSelectedLocation('North End, Boston');
      } else if (lowerLoc.includes('chicago')) {
        setSelectedLocation('River North, Chicago');
      } else if (lowerLoc.includes('miami')) {
        setSelectedLocation('Design District, Miami');
      } else if (lowerLoc.includes('seattle')) {
        setSelectedLocation('Capitol Hill, Seattle');
      } else {
        setSearchTerm(locParam);
      }
    }

    if (cuisineParam) {
      setSelectedCuisine(cuisineParam);
    }
  }, [searchParams]);

  // Derived filter options
  const cuisinesList = ['All', ...Array.from(new Set(restaurants.map(r => r.cuisine)))];
  const locationsList = ['All', ...Array.from(new Set(restaurants.map(r => r.location)))];

  // Filter logic
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCuisine =
      selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;

    const matchesPrice =
      selectedPrice === 'All' || restaurant.priceRange === selectedPrice;

    const matchesLocation =
      selectedLocation === 'All' || restaurant.location === selectedLocation;

    const matchesRating =
      restaurant.rating >= parseFloat(minRating);

    return matchesSearch && matchesCuisine && matchesPrice && matchesLocation && matchesRating;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex-grow">
      {/* Search Header */}
      <div className="mb-10 text-center md:text-left space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          Discover Fine Restaurants
        </h1>
        <p className="text-sm text-neutral-400 font-light">
          Filter through premium slots and menus to find your next unforgettable dining experience.
        </p>

        {/* Global Search Input */}
        <div className="relative max-w-2xl bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden focus-within:border-amber-500/80 transition-colors shadow-lg">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines, locations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none text-white pl-12 pr-4 py-3.5 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-amber-500" />
              Filter Results
            </h3>
            {(selectedCuisine !== 'All' || selectedPrice !== 'All' || selectedLocation !== 'All' || minRating !== '0' || searchTerm !== '') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('All');
                  setSelectedPrice('All');
                  setSelectedLocation('All');
                  setMinRating('0');
                }}
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Cuisine Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cuisine</h4>
            <select
              value={selectedCuisine}
              onChange={e => setSelectedCuisine(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-colors"
            >
              {cuisinesList.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Location Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Location</h4>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-colors"
            >
              {locationsList.map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Price Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Price Range</h4>
            <div className="grid grid-cols-4 gap-1.5 bg-neutral-950 p-1 border border-neutral-850 rounded-xl">
              {['All', '$$', '$$$', '$$$$'].map(price => (
                <button
                  key={price}
                  type="button"
                  onClick={() => setSelectedPrice(price)}
                  className={`py-1.5 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                    selectedPrice === price
                      ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
              <span>Min Rating</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                {parseFloat(minRating) === 0 ? 'Any' : `${minRating}+`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4.9"
              step="0.1"
              value={minRating}
              onChange={e => setMinRating(e.target.value)}
              className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-neutral-900 border border-neutral-850"
            />
          </div>
        </div>

        {/* Restaurants Cards Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Showing {filteredRestaurants.length} Restaurants</span>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 border border-neutral-900/60 rounded-3xl bg-neutral-950/20 text-center">
              <MapPin size={40} className="text-neutral-700 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white mb-1">No Restaurants Found</h3>
              <p className="text-xs text-neutral-500 max-w-sm">
                Try widening your search terms, clearing active filters, or exploring alternative locations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RestaurantListingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-400">
        <span className="inline-block animate-pulse">Loading Explore portal...</span>
      </div>
    }>
      <RestaurantListContent />
    </Suspense>
  );
}
