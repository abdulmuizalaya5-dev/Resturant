'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Phone, Mail, Award, CheckCircle2, MessageSquare, Utensils, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Button } from '@/components/Button';
import { Calendar } from '@/components/Calendar';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { ReviewCard } from '@/components/ReviewCard';
import { Modal } from '@/components/Modal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RestaurantDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { restaurants, reviews, addBooking, currentUser, addReview } = useAppState();

  const restaurant = restaurants.find(r => r.id === id);
  const restaurantReviews = reviews.filter(r => r.restaurantId === id);

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState(restaurant?.image || '');

  // Booking Form State
  const [bookingDate, setBookingDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingTime, setBookingTime] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [preOrderQuantities, setPreOrderQuantities] = useState<Record<string, number>>({});

  // Tabs State
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  // Review Input State
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Modals State
  const [bookingSuccessModalOpen, setBookingSuccessModalOpen] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] = useState(false);

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-neutral-400">
        <h2 className="text-xl font-bold text-white mb-2">Restaurant Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">The dining destination you are searching for does not exist or has been removed.</p>
        <Link href="/restaurants" passHref>
          <Button variant="primary">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  // Handle reserve submit
  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setAuthRequiredModalOpen(true);
      return;
    }

    if (!bookingTime) {
      alert('Please select an available time slot.');
      return;
    }

    const preOrderItems = Object.entries(preOrderQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = restaurant.menu.find(m => m.id === itemId);
        return {
          id: itemId,
          name: item?.name || 'Unknown Item',
          quantity: qty,
          price: item?.price || 0
        };
      });

    const booking = await addBooking({
      restaurantId: restaurant.id,
      date: bookingDate,
      time: bookingTime,
      guests: bookingGuests,
      specialRequests,
      preOrderItems: preOrderItems.length > 0 ? preOrderItems : undefined
    });

    if (booking) {
      setConfirmedBookingData(booking);
      setBookingSuccessModalOpen(true);
      // Reset form slot selection
      setBookingTime('');
      setSpecialRequests('');
      setPreOrderQuantities({});
    }
  };

  // Handle Review Submit
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthRequiredModalOpen(true);
      return;
    }
    if (!newReviewComment.trim()) {
      alert('Please write a review comment.');
      return;
    }
    addReview(restaurant.id, newReviewRating, newReviewComment);
    setNewReviewComment('');
    setNewReviewRating(5);
    alert('Thank you for your review!');
  };

  const menuCategories = Array.from(new Set(restaurant.menu.map(item => item.category)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex-grow font-sans text-neutral-200">
      {/* 1. Breadcrumbs */}
      <div className="text-xs text-neutral-500 mb-6 flex items-center gap-1.5 font-semibold">
        <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/restaurants" className="hover:text-amber-500 transition-colors">Explore</Link>
        <span>/</span>
        <span className="text-neutral-400">{restaurant.name}</span>
      </div>

      {/* 2. Restaurant Header Info */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">
            {restaurant.name}
          </h1>
          {/* Quick Rating Summary */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-neutral-950 rounded-lg text-sm font-bold shadow-lg">
              <Star size={14} fill="currentColor" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-neutral-400 font-medium">
              {restaurantReviews.length} Verified Reviews
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-neutral-400 font-light">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-amber-500/80 shrink-0" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Utensils size={16} className="text-amber-500/80 shrink-0" />
            <span>{restaurant.cuisine}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-amber-500/80 shrink-0" />
            <span>Hours: {restaurant.openingHours}</span>
          </div>
        </div>
      </div>

      {/* 3. Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Large main view */}
        <div className="lg:col-span-2 aspect-video rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-900 shadow-2xl relative">
          <img
            src={activeImage || restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>
        {/* Thumbnails list */}
        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 justify-start lg:justify-between h-full">
          {restaurant.images.map((img, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(img)}
              className={`aspect-video lg:h-[30%] shrink-0 rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                activeImage === img ? 'border-amber-500 scale-[0.98] shadow-md shadow-amber-500/10' : 'border-neutral-900 hover:border-neutral-700 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${restaurant.name} gallery ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Split content Details / Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 cols: Tabs Navigation & Tab content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tab Selection */}
          <div className="flex border-b border-neutral-900 pb-px gap-6">
            {(['menu', 'reviews', 'about'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
                  activeTab === tab ? 'text-amber-500 font-extrabold' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab === 'menu' ? 'Menu Preview' : tab === 'reviews' ? 'Reviews' : 'About & Details'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[300px]">
            {/* T1: Menu Preview */}
            {activeTab === 'menu' && (
              <div className="space-y-8 animate-fade-in">
                {menuCategories.map(cat => (
                  <div key={cat} className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 border-l-2 border-amber-500 pl-3">
                      {cat}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restaurant.menu
                        .filter(item => item.category === cat)
                        .map(item => (
                          <div
                            key={item.id}
                            className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-4 flex justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <h4 className="font-bold text-white text-sm">{item.name}</h4>
                              <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.description}</p>
                            </div>
                            <span className="text-sm font-bold text-amber-400 shrink-0 font-mono">${item.price}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* T2: Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-fade-in">
                {/* Submit review */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-5 space-y-4"
                >
                  <h4 className="text-sm font-bold text-white">Share Your Dining Experience</h4>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Rating:</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNewReviewRating(r)}
                          className={`p-1 cursor-pointer transition-colors ${
                            r <= newReviewRating ? 'text-amber-400' : 'text-neutral-700'
                          }`}
                        >
                          <Star size={16} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Comment</label>
                    <textarea
                      placeholder="Describe your meal, the ambiance, and the service..."
                      value={newReviewComment}
                      onChange={e => setNewReviewComment(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-900 border border-neutral-850 focus:border-amber-500/70 text-white rounded-xl p-3 text-sm focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="sm">
                    Submit Review
                  </Button>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {restaurantReviews.length === 0 ? (
                    <div className="py-10 text-center text-neutral-500 text-sm">
                      No reviews yet. Be the first to share your thoughts!
                    </div>
                  ) : (
                    restaurantReviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* T3: About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6 animate-fade-in text-sm text-neutral-300 font-light leading-relaxed">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 font-sans uppercase tracking-wider">About the Venue</h3>
                  <p>{restaurant.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-900">
                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">Contact Details</h4>
                    <ul className="space-y-2 text-xs text-neutral-400">
                      <li className="flex items-center gap-2">
                        <Phone size={12} className="text-amber-500" />
                        <span>{restaurant.phone}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Mail size={12} className="text-amber-500" />
                        <span>{restaurant.email}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">Amenities</h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {['Valet Parking', 'Wheelchair Access', 'Outdoor Seating', 'Sommelier Selects', 'Private Booths'].map(amenity => (
                        <span
                          key={amenity}
                          className="px-2.5 py-1 bg-neutral-900 border border-neutral-850 rounded-lg text-neutral-400 font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right col: Booking Reservation Widget */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="text-center pb-4 border-b border-neutral-800">
              <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Book a Table</span>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="text-lg font-bold text-white">Select Slot</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] uppercase font-bold tracking-wider font-mono">
                  Instant Match
                </span>
              </div>
            </div>

            <form onSubmit={handleReserve} className="space-y-5">
              {/* Date Input Grid */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon size={12} className="text-amber-500" />
                  1. Choose Date
                </label>
                <Calendar value={bookingDate} onChange={setBookingDate} />
              </div>

              {/* Guest selector */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={12} className="text-amber-500" />
                  2. Dining Party Size
                </label>
                <select
                  value={bookingGuests}
                  onChange={e => setBookingGuests(parseInt(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(g => (
                    <option key={g} value={g}>
                      {g} {g === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Slots grid */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-500" />
                  3. Select Dining Time
                </label>
                <TimeSlotPicker value={bookingTime} onChange={setBookingTime} />
              </div>

              {/* Special request */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Special Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Allergies, seating preference, anniversary..."
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 focus:border-amber-500/70 text-white rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
                />
              </div>

              {/* Pre-Order Section */}
              <div className="space-y-3 text-left border-t border-neutral-800/60 pt-4">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
                  <span>4. Pre-Order Dishes (Optional)</span>
                  <span className="text-[9px] text-amber-500 font-mono lowercase">Pre-cooked for arrival</span>
                </label>
                
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {restaurant.menu.map(item => {
                    const qty = preOrderQuantities[item.id] || 0;
                    return (
                      <div key={item.id} className="flex justify-between items-center gap-2 bg-neutral-950/60 border border-neutral-850 p-2 rounded-xl text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-amber-400/90 font-mono">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreOrderQuantities(prev => ({
                              ...prev,
                              [item.id]: Math.max(0, qty - 1)
                            }))}
                            className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
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
                            className="w-6 h-6 rounded-lg bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pre-Order Summary */}
                {Object.values(preOrderQuantities).some(q => q > 0) && (
                  <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-xs font-semibold">
                    <span className="text-neutral-400">Pre-Order Subtotal:</span>
                    <span className="text-amber-400 font-mono">
                      ${Object.entries(preOrderQuantities).reduce((acc, [id, qty]) => {
                        const price = restaurant.menu.find(m => m.id === id)?.price || 0;
                        return acc + price * qty;
                      }, 0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Reserve */}
              <Button type="submit" variant="primary" fullWidth className="py-3 shadow-md shadow-amber-500/15">
                Confirm Reservation
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Booking Success Modal */}
      {confirmedBookingData && (
        <Modal
          isOpen={bookingSuccessModalOpen}
          onClose={() => {
            setBookingSuccessModalOpen(false);
            router.push('/dashboard/customer/bookings');
          }}
          title="Reservation Confirmed"
        >
          <div className="text-center space-y-5 py-4">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center rounded-full">
              <CheckCircle2 size={24} />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white leading-none">Your Table is Reserved!</h4>
              <p className="text-xs text-neutral-500">
                A confirmation has been sent to your registered profile contact.
              </p>
            </div>

            <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 text-xs space-y-2 text-left text-neutral-400 font-mono">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Restaurant</span>
                <span className="font-bold text-white">{restaurant.name}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Booking ID</span>
                <span className="font-bold text-white">{confirmedBookingData.id}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Date & Time</span>
                <span className="font-bold text-white">{confirmedBookingData.date} @ {confirmedBookingData.time}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Guests</span>
                <span className="font-bold text-white">{confirmedBookingData.guests} People</span>
              </div>
              
              {confirmedBookingData.preOrderItems && confirmedBookingData.preOrderItems.length > 0 && (
                <div className="pt-2 space-y-1.5 border-t border-neutral-900">
                  <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Pre-Ordered Items</span>
                  {confirmedBookingData.preOrderItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-neutral-300">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-amber-400 font-bold pt-1.5 border-t border-neutral-900/50">
                    <span>Pre-Order Total</span>
                    <span>
                      ${confirmedBookingData.preOrderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setBookingSuccessModalOpen(false);
                router.push('/dashboard/customer/bookings');
              }}
            >
              Go to My Bookings
            </Button>
          </div>
        </Modal>
      )}

      {/* Authentication Required Modal */}
      <Modal
        isOpen={authRequiredModalOpen}
        onClose={() => setAuthRequiredModalOpen(false)}
        title="Authentication Required"
      >
        <div className="text-center space-y-5 py-4">
          <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center rounded-full">
            <Award size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white leading-none">Partner Sign In Required</h4>
            <p className="text-xs text-neutral-500">
              Please sign in or create an account to process real-time table reservations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/login" passHref legacyBehavior>
              <Button variant="outline" fullWidth onClick={() => setAuthRequiredModalOpen(false)}>
                Login
              </Button>
            </Link>
            <Link href="/register" passHref legacyBehavior>
              <Button variant="primary" fullWidth onClick={() => setAuthRequiredModalOpen(false)}>
                Register
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
