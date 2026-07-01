'use client';

import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { BookingCard } from '@/components/BookingCard';
import { Modal } from '@/components/Modal';
import { Booking } from '@/types';

export default function CustomerBookings() {
  const { currentUser, bookings, cancelBooking } = useAppState();
const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  // Ensure bookings is an array before applying filters
  const bookingsArray = Array.isArray(bookings) ? bookings : [];
  const customerBookings = bookingsArray.filter(b => b.customerId === currentUser?.id);

  const activeBookings = customerBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = customerBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
// Duplicate state removed
// Duplicate state removed

// Duplicate filter removed
  
// Duplicate filter removed
// Duplicate filter removed

  const displayBookings = activeTab === 'active' ? activeBookings : pastBookings;

  const handleCancelClick = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this fine dining reservation?')) {
      cancelBooking(bookingId);
      alert('Your reservation has been cancelled.');
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            My Reservations
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Track and manage your upcoming and historical table bookings.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-900 pb-px gap-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              activeTab === 'active' ? 'text-amber-500 font-extrabold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Active Reservations ({activeBookings.length})
            {activeTab === 'active' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer ${
              activeTab === 'past' ? 'text-amber-500 font-extrabold' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Past Dining ({pastBookings.length})
            {activeTab === 'past' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Bookings list */}
        <div className="space-y-4">
          {displayBookings.length === 0 ? (
            <div className="py-20 border border-neutral-900 border-dashed rounded-3xl text-center text-neutral-500 text-xs">
              <Calendar size={32} className="mx-auto text-neutral-700 mb-4 animate-pulse" />
              <p className="font-semibold text-neutral-400 mb-1">No Bookings Found</p>
              <p className="text-neutral-550">
                {activeTab === 'active'
                  ? "You don't have any active reservations currently."
                  : "You don't have any past dining history."}
              </p>
            </div>
          ) : (
            displayBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelClick}
                onViewDetails={setSelectedBooking}
              />
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title="Reservation Details"
        >
          <div className="space-y-5 text-sm py-2 text-neutral-300">
            <div className="flex gap-4 items-center border-b border-neutral-850 pb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800">
                <img src={selectedBooking.restaurantImage} alt={selectedBooking.restaurantName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base leading-snug">{selectedBooking.restaurantName}</h4>
                <span className="text-xs text-neutral-500 font-mono">Booking ID: {selectedBooking.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Date</span>
                <span className="font-bold text-white text-sm">{selectedBooking.date}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Time</span>
                <span className="font-bold text-white text-sm">{selectedBooking.time}</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Guests</span>
                <span className="font-bold text-white text-sm">{selectedBooking.guests} People</span>
              </div>
              <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Status</span>
                <span className="font-bold text-amber-400 capitalize text-sm">{selectedBooking.status}</span>
              </div>
            </div>

            {selectedBooking.tableNumber && (
              <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl text-xs flex justify-between items-center">
                <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Assigned Table</span>
                <span className="font-bold text-amber-400 uppercase font-mono text-sm">Table {selectedBooking.tableNumber}</span>
              </div>
            )}

            {selectedBooking.preOrderItems && selectedBooking.preOrderItems.length > 0 && (
              <div className="bg-neutral-950/60 border border-neutral-850 p-3 rounded-xl text-xs space-y-2">
                <span className="block text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Pre-Ordered Dishes</span>
                <div className="space-y-1.5">
                  {selectedBooking.preOrderItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-neutral-300">
                      <span>{item.name} <span className="text-neutral-500 font-mono">x{item.quantity}</span></span>
                      <span className="font-mono text-amber-400/90">${item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-1.5 border-t border-neutral-900 text-amber-400">
                    <span>Pre-Order Total</span>
                    <span>
                      ${selectedBooking.preOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedBooking.specialRequests && (
              <div className="bg-neutral-950/60 border border-neutral-850 p-3 rounded-xl text-xs space-y-1.5">
                <span className="block text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Special Requests</span>
                <p className="text-neutral-300 italic font-sans font-light">"{selectedBooking.specialRequests}"</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
