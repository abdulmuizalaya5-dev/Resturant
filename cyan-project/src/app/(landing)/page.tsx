'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Calendar as CalendarIcon, Users, Compass, Star, ChevronRight, Quote, Shield, Award, Zap, Bell, Clock, Eye, Utensils, CreditCard } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { RestaurantCard } from '@/components/RestaurantCard';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Calendar } from '@/components/Calendar';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { GoogleSignIn } from '@/components/GoogleSignIn';

// High-quality background images for the Hero slideshow
const heroImages = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80'
];

// Curated dishes for Menu Highlights Section
const menuHighlights = [
  {
    id: 'h-1',
    name: 'Caviar Impérial',
    category: 'Appetizers',
    price: 120,
    description: 'Siberian caviar served with gold leaf blinis and double cream.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80',
    restaurant: "L'Ambroisie",
    restaurantId: 'rest-1'
  },
  {
    id: 'h-2',
    name: 'Tuscan Burrata',
    category: 'Appetizers',
    price: 24,
    description: 'Creamy burrata, heirloom tomatoes, basil oil, aged balsamic glaze.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=500&q=80',
    restaurant: 'Taverna Toscana',
    restaurantId: 'rest-3'
  },
  {
    id: 'h-3',
    name: 'Canard Rôti aux Pêches',
    category: 'Mains',
    price: 78,
    description: 'Roasted duck breast with caramelized peaches and honey reduction.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80',
    restaurant: "L'Ambroisie",
    restaurantId: 'rest-1'
  },
  {
    id: 'h-4',
    name: "Chef's Omakase Selection",
    category: 'Mains',
    price: 250,
    description: 'Progression of daily selections including bluefin otoro, uni, and wagyu.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80',
    restaurant: 'Sakura Sushi Zen',
    restaurantId: 'rest-2'
  },
  {
    id: 'h-5',
    name: 'Valrhona Chocolate Soufflé',
    category: 'Desserts',
    price: 28,
    description: 'Dark chocolate soufflé served with Grand Marnier ice cream.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
    restaurant: "L'Ambroisie",
    restaurantId: 'rest-1'
  },
  {
    id: 'h-6',
    name: 'Matcha Lava Cake',
    category: 'Desserts',
    price: 22,
    description: 'Uji matcha lava cake with black sesame gelato.',
    image: 'https://images.unsplash.com/photo-1536680465769-2365207b035e?auto=format&fit=crop&w=500&q=80',
    restaurant: 'Sakura Sushi Zen',
    restaurantId: 'rest-2'
  }
];

// Fallback Floor Plan configuration if DB is empty
const defaultTablesData = [
  { id: 't1', name: 'Table 1', seats: 2, x: 20, y: 30, status: 'available' },
  { id: 't2', name: 'Table 2', seats: 4, x: 50, y: 30, status: 'reserved' },
  { id: 't3', name: 'Table 3', seats: 2, x: 80, y: 30, status: 'available' },
  { id: 't4', name: 'Table 4', seats: 6, x: 25, y: 70, status: 'available' },
  { id: 't5', name: 'Table 5', seats: 8, x: 65, y: 70, status: 'occupied' }
];

// Helper to calculate coordinates dynamically for table positions on the dining map
const getTableLayoutCoords = (index: number, total: number) => {
  const positions = [
    { x: 20, y: 25 },
    { x: 50, y: 25 },
    { x: 80, y: 25 },
    { x: 25, y: 70 },
    { x: 75, y: 70 },
    { x: 15, y: 48 },
    { x: 85, y: 48 },
    { x: 50, y: 72 }
  ];
  return positions[index % positions.length];
};

export default function Home() {
  const router = useRouter();
  const { restaurants, tables, login, addBooking, currentUser, paymentMethods } = useAppState();
  
  // Search state
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [time, setTime] = useState('19:00');

  // Interactive component states
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeMenuTab, setActiveMenuTab] = useState('Mains');
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('rest-1');

  // Instant Booking Form Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingTime, setBookingTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [preOrderQuantities, setPreOrderQuantities] = useState<Record<string, number>>({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  const [loginError, setLoginError] = useState('');
  
  // Flash Offers Countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 45 });

  // Auto-rotate background slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update selected restaurant layout when restaurants load
  useEffect(() => {
    if (restaurants && restaurants.length > 0 && !restaurants.find(r => r.id === selectedRestaurantId)) {
      setSelectedRestaurantId(restaurants[0].id);
    }
  }, [restaurants, selectedRestaurantId]);

  // Live Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 }; // reset loop
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter restaurants safely
  const featuredRestaurants = Array.isArray(restaurants) ? restaurants.filter(r => r.featured) : [];
  const topRatedRestaurants = Array.isArray(restaurants) ? [...restaurants]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3) : [];

  const selectedRestaurantObj = restaurants.find(r => r.id === selectedRestaurantId);

  // Filter tables matching the selected restaurant layout
  const restaurantTables = tables.filter(t => t.restaurantId === selectedRestaurantId);
  const displayTables = restaurantTables.length > 0 ? restaurantTables.map((t, idx) => {
    const coords = getTableLayoutCoords(idx, restaurantTables.length);
    return {
      id: t.id,
      name: `Table ${t.number}`,
      seats: t.capacity,
      x: coords.x,
      y: coords.y,
      status: t.status,
      number: t.number
    };
  }) : defaultTablesData;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({ location, guests, date, time }).toString();
    router.push(`/restaurants?${query}`);
  };

  const handleCuisineClick = (cuisine: string) => {
    router.push(`/restaurants?cuisine=${encodeURIComponent(cuisine)}`);
  };

  const handleInstantReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!currentUser) {
      setLoginError('Please login to complete your reservation.');
      return;
    }

    if (!bookingTime) {
      alert('Please select an available dinner time slot.');
      return;
    }

    if (!selectedRestaurantObj) return;

    const preOrderItems = Object.entries(preOrderQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = selectedRestaurantObj.menu.find((m: any) => m.id === itemId);
        return {
          id: itemId,
          name: item?.name || 'Unknown Item',
          quantity: qty,
          price: item?.price || 0
        };
      });

    const booking = await addBooking({
      restaurantId: selectedRestaurantObj.id,
      date: bookingDate,
      time: bookingTime,
      guests: bookingGuests,
      specialRequests,
      preOrderItems: preOrderItems.length > 0 ? preOrderItems : undefined
    });

    if (booking) {
      setConfirmedBookingData(booking);
      setBookingSuccess(true);
      // Visual feedback: mark selected table as reserved/occupied
      if (selectedTable) {
        setSelectedTable((prev: any) => prev ? { ...prev, status: 'reserved' } : null);
      }
    } else {
      alert('An error occurred. Failed to complete reservation.');
    }
  };

  const cuisines = [
    { name: 'French Fine Dining', count: 12, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', tag: 'French Fine Dining' },
    { name: 'Japanese Omakase', count: 8, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80', tag: 'Japanese Omakase' },
    { name: 'Rustic Italian', count: 15, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80', tag: 'Rustic Italian' },
    { name: 'Steakhouses', count: 6, image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=400&q=80', tag: 'American Steakhouse' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 overflow-x-hidden text-neutral-250">
      
      {/* 1. Live activity news ticker marquee */}
      <div className="w-full bg-amber-500 text-neutral-950 py-2.5 px-4 font-bold text-xs uppercase tracking-widest flex items-center overflow-hidden z-20 shadow-md">
        <div className="flex items-center gap-2 shrink-0 bg-neutral-950 text-amber-400 px-3 py-1 rounded-full mr-4 border border-amber-400/20 text-[10px]">
          <Bell size={12} className="animate-swing animate-pulse" />
          <span>Live updates</span>
        </div>
        <div className="flex animate-marquee whitespace-nowrap gap-16">
          <span>🔔 Table for 2 reserved at Sakura Sushi Zen (12 mins ago)</span>
          <span>🔔 Guest Elena R. pre-ordered Caviar Impérial at L'Ambroisie</span>
          <span>🔔 Chef Marco opened 3 premium tables for tonight at Taverna Toscana</span>
          <span>🔔 Private lounge slot booked for 8 guests at The Golden Ember</span>
        </div>
      </div>

      {/* 2. Hero Section with Ken Burns slideshow */}
      <section className="relative min-h-[85vh] flex items-center justify-center py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-neutral-950">
          {heroImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === heroIdx ? 'opacity-35' : 'opacity-0'
              }`}
            >
              <img
                src={imgUrl}
                alt="Slideshow Background"
                className={`w-full h-full object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                  idx === heroIdx ? 'scale-110 translate-y-1' : 'scale-100 translate-y-0'
                }`}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/40 to-neutral-950" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
        </div>

        <div className="relative z-10 max-w-5xl w-full text-center space-y-10">
          <div className="space-y-6 animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Exquisite Dining Reservations
            </span>
            <h1 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight leading-none font-sans">
              Secure a Table at the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 hover:brightness-110 transition-all duration-300">
                World's Finest Restaurants
              </span>
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto text-base sm:text-xl font-light leading-relaxed">
              Skip waitlists and unlock culinary journeys. Discover curated dining slots at Michelin-star venues and premium local bistros.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up delay-300"
          >
            <div className="flex flex-col text-left group">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 group-focus-within:text-amber-400 transition-colors">
                <MapPin size={11} className="text-amber-500" />
                Location
              </label>
              <input
                type="text"
                placeholder="City or Restaurant..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="bg-neutral-950/80 border border-neutral-800 focus:border-amber-500/70 text-white rounded-xl px-3.5 py-2 text-sm focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300"
              />
            </div>

            <div className="flex flex-col text-left group">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 group-focus-within:text-amber-400 transition-colors">
                <CalendarIcon size={11} className="text-amber-500" />
                Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toLocaleDateString('en-CA')}
                onChange={e => setDate(e.target.value)}
                className="bg-neutral-950/80 border border-neutral-800 focus:border-amber-500/70 text-white rounded-xl px-3.5 py-2 text-sm focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 cursor-pointer"
              />
            </div>

            <div className="flex flex-col text-left group">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 group-focus-within:text-amber-400 transition-colors">
                <Users size={11} className="text-amber-500" />
                Guests
              </label>
              <select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="bg-neutral-950/80 border border-neutral-800 focus:border-amber-500/70 text-white rounded-xl px-3.5 py-2 text-sm focus:ring-4 focus:ring-amber-500/5 outline-none transition-all duration-300 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
                  <option key={g} value={g}>
                    {g} {g === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" variant="primary" fullWidth className="h-10 text-sm py-2 group/btn relative overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.3)]">
                <Search size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" />
                <span>Find Tables</span>
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Special Event / Live Flash Offer Countdown */}
      <section className="py-12 bg-neutral-900 border-y border-neutral-850 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 shrink-0">
              <Clock size={28} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Tonight's Chef Special Slot</span>
              <h3 className="text-lg font-bold text-white leading-tight mt-0.5">Exclusive 18-Course Omakase - Sakura Sushi Zen</h3>
              <p className="text-xs text-neutral-400 font-light mt-0.5">1 premium reservation slot has opened up at the sushi counter.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Countdown timer */}
            <div className="flex gap-2 font-mono">
              {[
                { val: timeLeft.hours, label: 'hr' },
                { val: timeLeft.minutes, label: 'min' },
                { val: timeLeft.seconds, label: 'sec' }
              ].map((timeUnit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white font-extrabold text-sm min-w-[42px] text-center shadow-md shadow-amber-500/2">
                    {timeUnit.val.toString().padStart(2, '0')}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-neutral-500 mt-1">{timeUnit.label}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => router.push('/restaurants/rest-2')}
              variant="primary"
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold text-xs"
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Popular Cuisines Section */}
      <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
            <div className="space-y-2 font-sans">
              <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block">Categories</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Popular Cuisines
              </h2>
            </div>
            <button
              onClick={() => router.push('/restaurants')}
              className="text-amber-500 hover:text-amber-400 text-sm font-bold flex items-center gap-1.5 transition-colors mt-4 sm:mt-0 cursor-pointer group animate-pulse-slow"
            >
              Explore all restaurants
              <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cuisines.map((cuisine, idx) => (
              <div
                key={idx}
                onClick={() => handleCuisineClick(cuisine.tag)}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-900/80 cursor-pointer shadow-lg hover:border-amber-500/30 hover:shadow-[0_10px_30px_rgba(245,158,11,0.05)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-neutral-900 transition-all duration-700 group-hover:scale-110">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent transition-all duration-500 group-hover:via-neutral-950/20" />
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end transform transition-transform duration-500 group-hover:-translate-y-1">
                  <h4 className="text-white font-extrabold text-lg leading-tight group-hover:text-amber-400 transition-colors">
                    {cuisine.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                      {cuisine.count} restaurants
                    </span>
                    <ChevronRight size={10} className="text-amber-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gourmet Journey / Chef Masterclass & Wine Pairing Showcase Section */}
      <section className="py-24 px-6 bg-neutral-900/10 border-t border-neutral-900 relative">
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block">Culinary Journeys</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              Curated Gastronomic Experiences
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
              Step inside the world's most creative kitchens. From private chef tutorials to exclusive sommelier pairings, discover experiences curated for true culinary enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Main large card */}
            <div className="md:col-span-7 group relative rounded-3xl overflow-hidden border border-neutral-900 flex flex-col justify-end p-8 sm:p-12 min-h-[400px] shadow-2xl hover:border-amber-500/20 transition-all duration-500">
              <div className="absolute inset-0 bg-neutral-950">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80"
                  alt="Chef plating dish"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              
              <div className="relative z-10 space-y-4 max-w-xl text-left">
                <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-full w-fit block">
                  ★ Masterclass Exclusive
                </span>
                <h3 className="text-xl sm:text-3xl font-extrabold text-white leading-tight font-sans">
                  Kitchen Secrets: Omakase Plating & Sommelier Pairings
                </h3>
                <p className="text-neutral-400 text-xs font-light leading-relaxed">
                  Join Chef Marco Rossi for an exclusive behind-the-scenes masterclass. Learn how to select the freshest seasonal ingredients, balance intricate flavors, and pair vintage wines.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => router.push('/restaurants/rest-2')}
                    variant="primary"
                    size="sm"
                    className="text-xs bg-amber-500 hover:bg-amber-600 text-neutral-950 shadow-md shadow-amber-500/10 font-bold"
                  >
                    Reserve Chef's Counter Slot
                  </Button>
                </div>
              </div>
            </div>

            {/* Split right grid */}
            <div className="md:col-span-5 flex flex-col gap-8 justify-between">
              
              {/* Card 1 */}
              <div className="group relative rounded-3xl overflow-hidden border border-neutral-900 flex-1 p-8 flex items-center gap-6 shadow-xl hover:border-amber-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-neutral-950">
                  <img
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80"
                    alt="Wine collection cellars"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                
                <div className="relative z-10 space-y-2 text-left">
                  <span className="text-[9px] uppercase font-bold text-amber-500 tracking-widest block">Cellar Tour</span>
                  <h4 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    Private Sommelier Tastings
                  </h4>
                  <p className="text-neutral-450 text-[11px] font-light leading-relaxed max-w-xs">
                    Access private cellars holding some of the rarest vintages in the city. Custom pairings curated by master sommeliers.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-3xl overflow-hidden border border-neutral-900 flex-1 p-8 flex items-center gap-6 shadow-xl hover:border-amber-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-neutral-950">
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80"
                    alt="Tasting courses"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
                
                <div className="relative z-10 space-y-2 text-left">
                  <span className="text-[9px] uppercase font-bold text-amber-500 tracking-widest block">Exclusive Tables</span>
                  <h4 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                    Seasonal Tasting Menus
                  </h4>
                  <p className="text-neutral-450 text-[11px] font-light leading-relaxed max-w-xs">
                    Explore multi-course tasting menus created by world-renowned chefs. Available only to CyanReserve diners.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Interactive Seating Map Selections */}
      <section className="py-24 px-6 bg-neutral-900/10 border-y border-neutral-900/85">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          <div className="lg:col-span-2 text-left space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block">Interactive Lounge</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
                Virtual Dining Map Preview
              </h2>
            </div>
            
            <p className="text-neutral-450 text-sm font-light leading-relaxed">
              CyanReserve introduces direct table assignments. Select a table to preview seat capacities and real-time occupancy. Reserve the exact layout matching your preference.
            </p>

            {/* Restaurant Seating Selector */}
            {restaurants && restaurants.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Select Seating Floor Map:
                </label>
                <select
                  value={selectedRestaurantId}
                  onChange={(e) => {
                    setSelectedRestaurantId(e.target.value);
                    setSelectedTable(null);
                  }}
                  className="w-full bg-neutral-950 border border-neutral-850 text-white rounded-xl px-4 py-3 text-xs outline-none transition-all cursor-pointer font-bold focus:border-amber-500"
                >
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.cuisine}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedTable ? (
              <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-2xl space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-base">{selectedTable.name}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider border ${
                    selectedTable.status === 'available'
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : selectedTable.status === 'reserved'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {selectedTable.status}
                  </span>
                </div>
                
                <div className="text-xs space-y-1.5 text-neutral-400 font-light">
                  <p>Capacity bounds: <strong className="text-white font-semibold font-mono">{selectedTable.seats} Seats</strong></p>
                  <p>Recommended cuisine pairing: <strong className="text-white font-semibold">{selectedRestaurantObj?.cuisine || 'Haute French'}</strong></p>
                </div>

                {selectedTable.status === 'available' ? (
                  <Button
                    onClick={() => {
                      setBookingDate(new Date().toLocaleDateString('en-CA'));
                      setBookingGuests(selectedTable.seats);
                      setBookingTime('');
                      setSpecialRequests('');
                      setPreOrderQuantities({});
                      setBookingSuccess(false);
                      setConfirmedBookingData(null);
                      setLoginError('');
                      setBookingModalOpen(true);
                    }}
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="text-xs py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-bold"
                  >
                    Select This Table
                  </Button>
                ) : (
                  <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl text-center text-[10px] text-neutral-500 font-semibold uppercase">
                    This table is already {selectedTable.status}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 border border-dashed border-neutral-800 rounded-2xl text-center text-xs text-neutral-500">
                Click any table on the interactive layout floor-plan preview to explore reservation configurations.
              </div>
            )}
          </div>

          {/* Table Layout Visualizer */}
          <div className="lg:col-span-3 bg-neutral-950 border border-neutral-850 aspect-[4/3] rounded-3xl p-8 relative flex items-center justify-center shadow-2xl overflow-hidden">
            {/* Floor texture/pattern grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/20 to-neutral-950" />
            
            {/* Live Dining Room Stage */}
            <div className="relative w-full h-full max-w-[450px] max-h-[300px] border border-neutral-850/60 rounded-2xl bg-neutral-900/10 p-6 flex flex-col justify-between">
              
              {/* Room Elements */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-neutral-800/80 border border-neutral-750 px-4 py-1 rounded-b-xl text-[8px] uppercase tracking-widest font-bold text-neutral-400">
                Reception Entrance
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-amber-500/10 border-l border-amber-500/20 px-1 py-4 rounded-l-xl text-[8px] uppercase tracking-widest font-bold text-amber-500 writing-mode-vertical">
                Main Stage Chef Station
              </div>

              {/* Table Nodes */}
              {displayTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  style={{ left: `${table.x}%`, top: `${table.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border flex flex-col items-center justify-center shadow-lg transition-all duration-300 ${
                    selectedTable?.id === table.id
                      ? 'border-amber-400 bg-amber-500/20 text-white scale-110 shadow-amber-500/10'
                      : table.status === 'available'
                      ? 'border-green-500/40 bg-green-500/5 hover:border-green-400 text-green-400 hover:scale-105'
                      : table.status === 'reserved'
                      ? 'border-amber-500/40 bg-amber-500/5 hover:border-amber-400 text-amber-400 hover:scale-105'
                      : 'border-red-500/40 bg-red-500/5 text-red-400 opacity-60 cursor-not-allowed'
                  }`}
                  title={`${table.name} (${table.seats} Seats) - ${table.status}`}
                >
                  <span className="text-[10px] font-extrabold font-mono">{table.seats}</span>
                  <span className="text-[7px] uppercase font-bold tracking-tighter opacity-80">{table.name}</span>
                </button>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* 7. Live Chef's Signature Menu Highlights (Tab-controlled category preview) */}
      <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2 text-left">
              <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block">Gourmet Selection</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                Signature Menu Highlights
              </h2>
            </div>
            
            {/* Category tabs */}
            <div className="flex gap-2 bg-neutral-900 border border-neutral-850 p-1.5 rounded-2xl self-start sm:self-auto">
              {['Appetizers', 'Mains', 'Desserts'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveMenuTab(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeMenuTab === cat
                      ? 'bg-amber-500 text-neutral-950 font-black shadow-lg shadow-amber-500/5'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tabbed Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuHighlights
              .filter((dish) => dish.category === activeMenuTab)
              .map((dish, idx) => (
                <div
                  key={dish.id}
                  className="group bg-neutral-900/30 border border-neutral-900 hover:border-neutral-850 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-350 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Photo with hover reveal/zoom */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    <span className="absolute bottom-4 right-4 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-amber-400 font-extrabold font-mono text-sm px-3.5 py-1.5 rounded-xl shadow-lg">
                      ${dish.price}
                    </span>
                  </div>

                  {/* Details Card */}
                  <div className="p-6 space-y-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
                        Offered at {dish.restaurant}
                      </span>
                      <h4 className="font-extrabold text-white text-base group-hover:text-amber-400 transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-neutral-900 flex justify-between items-center">
                      <span className="text-[10px] text-neutral-500 font-semibold flex items-center gap-1">
                        <Utensils size={10} className="text-amber-500" />
                        Signature dish
                      </span>
                      <button
                        onClick={() => router.push(`/restaurants/${dish.restaurantId}`)}
                        className="text-amber-500 hover:text-amber-400 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        Reserve Table
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 8. Featured Establishments Section */}
      <section className="py-24 px-6 bg-neutral-900/10 border-y border-neutral-900/80 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block">Curated Listings</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                Featured Establishments
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.length > 0 ? (
              featuredRestaurants.map((restaurant, idx) => (
                <div key={restaurant.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-500 text-sm">
                No featured restaurants available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Top Rated Culinary Destinations */}
      <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block mb-2">Highly Acclaimed</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Top Rated Culinary Destinations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topRatedRestaurants.length > 0 ? (
              topRatedRestaurants.map((restaurant, idx) => (
                <div key={restaurant.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-500 text-sm">
                No top-rated restaurants found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 10. Testimonial Section */}
      <section id="testimonials" className="py-24 px-6 bg-neutral-900/20 border-t border-neutral-900 relative">
        <div className="max-w-4xl mx-auto text-center space-y-16 relative z-10">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold text-amber-500 tracking-widest">Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              What Culinary Seekers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="group bg-neutral-950/40 border border-neutral-850 hover:border-neutral-800 p-8 rounded-3xl relative shadow-2xl transition-all duration-350 hover:-translate-y-1">
              <Quote className="absolute top-8 right-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors" size={48} />
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-800 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                    alt="Sarah Jenkins"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Sarah Jenkins</h4>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Fine Dining Connoisseur</span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed italic font-sans font-light">
                "Securing a table at Sakura Sushi Zen used to be impossible. Using CyanReserve, I booked a prime omakase slot in less than two minutes. The live confirmations work flawlessly!"
              </p>
            </div>

            <div className="group bg-neutral-950/40 border border-neutral-850 hover:border-neutral-800 p-8 rounded-3xl relative shadow-2xl transition-all duration-350 hover:-translate-y-1">
              <Quote className="absolute top-8 right-8 text-amber-500/10 group-hover:text-amber-500/20 transition-colors" size={48} />
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-800 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    alt="David Miller"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">David Miller</h4>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Regular Gourmet Diner</span>
                </div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed italic font-sans font-light">
                "The interface is so clean. I love that I can browse menus, read verified reviews, and pick exact table configurations. Highly recommended for dining out."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Why Choose Us Section with interactive hover elements */}
      <section className="py-24 px-6 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold text-amber-500 tracking-widest block">Premium Experience</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Why Choose CyanReserve?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Confirmation',
                desc: 'Book a table in seconds with live verification. No back-and-forth phone calls or uncertainty.',
                icon: <Zap size={24} className="text-amber-500" />
              },
              {
                title: 'Premium Partners Only',
                desc: 'A meticulously curated catalogue of local culinary landmarks, award-winners, and Michelin establishments.',
                icon: <Award size={24} className="text-amber-500" />
              },
              {
                title: 'Secure Reservations',
                desc: 'Your details are encrypted and integrated directly with the venue’s floor management system.',
                icon: <Shield size={24} className="text-amber-500" />
              }
            ].map((item, i) => (
              <div
                key={i}
                className="group relative p-8 bg-neutral-900/30 border border-neutral-900 hover:border-neutral-850 rounded-3xl shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 text-left space-y-4 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-3xl border border-amber-500/0 group-hover:border-amber-500/10 transition-colors pointer-events-none" />
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-neutral-950 border border-neutral-800 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-450 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Instant Booking Modal ─── */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setBookingSuccess(false);
          setConfirmedBookingData(null);
          setSpecialRequests('');
          setPreOrderQuantities({});
          setBookingTime('');
          setLoginError('');
        }}
        title={`Table Seating Reservation – ${selectedRestaurantObj?.name || 'CyanReserve'}`}
        maxWidth="xl"
      >
        {!currentUser ? (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
              <Shield size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Dining Account Required</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Please sign in to confirm this premium table reservation at <strong className="text-white">{selectedRestaurantObj?.name}</strong>.
              </p>
            </div>
            
            {loginError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-xl max-w-xs mx-auto">
                {loginError}
              </div>
            )}

            {/* Quick Login Options */}
            <div className="space-y-3 max-w-xs mx-auto">
              <Button
                onClick={async () => {
                  setLoginError('');
                  const res = await login({ email: 'sarah.j@example.com', role: 'customer' });
                  if (!res.success) {
                    setLoginError(res.error || 'Quick Login Failed');
                  }
                }}
                variant="primary"
                fullWidth
                className="text-xs py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-bold"
              >
                Quick Sign In as Sarah Jenkins (Demo Guest)
              </Button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    router.push('/portal/diner');
                  }}
                  className="flex-1 py-2.5 bg-neutral-955 hover:bg-neutral-900 border border-neutral-850 text-xs font-semibold rounded-xl text-neutral-300 transition-colors cursor-pointer"
                >
                  Enter Portal
                </button>
                <button
                  onClick={() => {
                    setBookingModalOpen(false);
                    router.push('/register');
                  }}
                  className="flex-1 py-2.5 bg-neutral-955 hover:bg-neutral-900 border border-neutral-850 text-xs font-semibold rounded-xl text-neutral-300 transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>

              <div className="relative flex items-center justify-center my-3">
                <span className="absolute w-full border-t border-neutral-900" />
                <span className="relative px-2.5 bg-neutral-950 text-[10px] uppercase font-bold tracking-wider text-neutral-600">
                  Or continue with
                </span>
              </div>

              <div className="w-full flex justify-center">
                <GoogleSignIn
                  role="customer"
                  textType="signin_with"
                  onSuccess={() => setBookingModalOpen(false)}
                />
              </div>
            </div>
          </div>
        ) : bookingSuccess ? (
          <div className="space-y-6 text-center py-6 animate-fade-in">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mx-auto">
              <Utensils size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Booking Confirmed! ✅</h3>
              <p className="text-xs text-neutral-450 max-w-md mx-auto leading-relaxed">
                Hi {currentUser.name.split(' ')[0]}, your table at <strong className="text-white">{selectedRestaurantObj?.name}</strong> has been secured. A confirmation email has been dispatched to <strong className="text-white">{currentUser.email}</strong> via Brevo.
              </p>
            </div>

            {confirmedBookingData && (
              <div className="bg-neutral-950 border border-neutral-850 p-5 rounded-2xl max-w-md mx-auto text-left space-y-3 text-xs font-light">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Booking Reference</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">#{confirmedBookingData.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Restaurant</span>
                  <span className="text-white font-bold">{selectedRestaurantObj?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Allocated Table</span>
                  <span className="text-white font-bold">{selectedTable?.name} ({selectedTable?.seats} Seats)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Date & Time</span>
                  <span className="text-white font-bold">{confirmedBookingData.date} @ {confirmedBookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Dining Guests</span>
                  <span className="text-white font-bold">{confirmedBookingData.guests} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-medium">Email Sent Status</span>
                  <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] uppercase font-bold tracking-wider font-mono">Brevo Sent</span>
                </div>

                {confirmedBookingData.preOrderItems && confirmedBookingData.preOrderItems.length > 0 && (
                  <div className="pt-2.5 border-t border-neutral-900 space-y-2">
                    <span className="text-neutral-500 font-bold uppercase tracking-wider block text-[9px]">Pre-Ordered Courses:</span>
                    {confirmedBookingData.preOrderItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-neutral-400">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-mono text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex gap-3 max-w-xs mx-auto">
              <Button
                onClick={() => {
                  setBookingModalOpen(false);
                  router.push('/dashboard/customer');
                }}
                variant="primary"
                fullWidth
                className="text-xs py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => {
                  setBookingModalOpen(false);
                  setBookingSuccess(false);
                  setConfirmedBookingData(null);
                  setSpecialRequests('');
                  setPreOrderQuantities({});
                  setBookingTime('');
                }}
                variant="outline"
                fullWidth
                className="border-neutral-800 text-neutral-300 hover:bg-neutral-900 text-xs py-2.5"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInstantReserveSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Column 1: Date & Time Picker */}
              <div className="space-y-5">
                <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <CalendarIcon size={12} className="text-amber-500" />
                    1. Choose Seating Date
                  </h4>
                  <Calendar value={bookingDate} onChange={setBookingDate} />
                </div>

                <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <Clock size={12} className="text-amber-500" />
                    2. Select Dining Time Slot
                  </h4>
                  <TimeSlotPicker value={bookingTime} onChange={setBookingTime} />
                </div>
              </div>

              {/* Column 2: Guest Size, Special Notes, Pre-order Dishes */}
              <div className="space-y-5 flex flex-col justify-between">
                <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-neutral-850 pb-2 flex items-center gap-1.5">
                    <Users size={12} className="text-amber-500" />
                    3. Seating Capacity Options
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Allocated Table</span>
                      <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold">
                        {selectedTable?.name || 'Selected Table'}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Party Size</span>
                      <select
                        value={bookingGuests}
                        onChange={e => setBookingGuests(parseInt(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-colors font-semibold"
                      >
                        {Array.from({ length: selectedTable?.seats || 2 }, (_, i) => i + 1).map(g => (
                          <option key={g} value={g}>
                            {g} {g === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Special Notes (Optional)</span>
                    <input
                      type="text"
                      placeholder="Anniversary, window table, food allergies..."
                      value={specialRequests}
                      onChange={e => setSpecialRequests(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500/75 text-white rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Pre-order menu board */}
                <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-2xl flex-grow space-y-4 min-h-[220px]">
                  <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Utensils size={12} className="text-amber-500" />
                      4. Pre-Order Courses (Optional)
                    </h4>
                    <span className="text-[9px] text-amber-500 font-mono font-bold uppercase">Pre-cooked</span>
                  </div>

                  {selectedRestaurantObj ? (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {selectedRestaurantObj.menu.map((item: any) => {
                        const qty = preOrderQuantities[item.id] || 0;
                        return (
                          <div key={item.id} className="flex justify-between items-center gap-4 bg-neutral-900 border border-neutral-850/80 p-2.5 rounded-xl text-xs">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-neutral-400 font-light truncate max-w-[200px]">{item.description}</p>
                              <p className="text-[10px] text-amber-400/90 font-mono mt-0.5 font-bold">${item.price}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreOrderQuantities(prev => ({
                                  ...prev,
                                  [item.id]: Math.max(0, qty - 1)
                                }))}
                                className="w-6 h-6 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-bold font-mono text-white text-xs">{qty}</span>
                              <button
                                type="button"
                                onClick={() => setPreOrderQuantities(prev => ({
                                  ...prev,
                                  [item.id]: qty + 1
                                }))}
                                className="w-6 h-6 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-6">Select a restaurant layout to load its menu.</p>
                  )}
                </div>

                {/* 💳 Payment Method Selection Card */}
                <div className="bg-neutral-950/40 border border-neutral-850 p-4 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={12} className="text-amber-500" />
                      5. Secure Checkout Method
                    </h4>
                  </div>
                  
                  {paymentMethods.length === 0 ? (
                    <div className="space-y-3">
                      <p className="text-[10px] text-neutral-400 font-light leading-relaxed">
                        You do not have any saved payment cards in your profile.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingModalOpen(false);
                          router.push('/dashboard/customer/billing');
                        }}
                        className="w-full text-center py-2.5 border border-dashed border-neutral-800 hover:border-amber-500/30 rounded-xl text-[10px] uppercase font-bold text-amber-500 hover:bg-amber-500/5 transition-all cursor-pointer"
                      >
                        Add Card in Portal &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider block">Select Saved Card</span>
                      <select
                        className="w-full bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none font-semibold transition-colors cursor-pointer"
                        defaultValue={paymentMethods.find(p => p.isDefault)?.id || paymentMethods[0]?.id}
                      >
                        {paymentMethods.map(pm => (
                          <option key={pm.id} value={pm.id}>
                            💳 {pm.brand.toUpperCase()} ending in {pm.last4} ({pm.name})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Subtotal tracker & Submit */}
                <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-500 font-bold uppercase tracking-wider">Total Pre-Order Bill:</span>
                    <span className="text-lg font-extrabold text-amber-400 font-mono">
                      ${selectedRestaurantObj ? Object.entries(preOrderQuantities)
                        .reduce((sum, [itemId, qty]) => {
                          const item = selectedRestaurantObj.menu.find((m: any) => m.id === itemId);
                          return sum + (item?.price || 0) * qty;
                        }, 0)
                        .toFixed(2) : '0.00'}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-neutral-950 font-black text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(245,158,11,0.2)]"
                  >
                    Confirm Table Reservation & Receipt &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Embedded Animations styling block */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        .animate-marquee {
          animation: marquee 35s linear infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -6px);
          }
        }

        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
