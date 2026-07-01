'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, XCircle, TrendingUp, UserCheck, Utensils, MessageSquare, Heart } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { BookingCard } from '@/components/BookingCard';
import { Modal } from '@/components/Modal';
import { Booking } from '@/types';

export default function CustomerDashboard() {
  const { currentUser, bookings, restaurants } = useAppState();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter bookings for current logged-in customer
  const customerBookings = bookings.filter(b => b.customerId === currentUser?.id);
  const upcomingBookings = customerBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookingsCount = customerBookings.filter(b => b.status === 'completed').length;
  const cancelledCount = customerBookings.filter(b => b.status === 'cancelled').length;

  // Recent reviews count or activity logs
  const activityLogs = [
    { text: 'Profile updated successfully', time: '1 day ago', type: 'profile' },
    ...(customerBookings.length > 0 ? [{ text: `Booked a table at ${customerBookings[0].restaurantName}`, time: '2 days ago', type: 'booking' }] : []),
    { text: 'Joined CyanReserve fine dining network', time: 'June 2026', type: 'system' }
  ];

  return (
    <DashboardLayout role="customer">
      <div className="space-y-8 font-sans">
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
              Welcome Back, {currentUser?.name || 'Diner'}
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Diner Dashboard • Active Reservations
            </p>
          </div>
          <Link href="/restaurants" className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl transition-all shadow-lg shadow-amber-500/10 active:scale-98">
            Book a New Table
          </Link>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Upcoming Bookings</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {upcomingBookings.length}
              </span>
            </div>
          </Card>

          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Past Visits</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {pastBookingsCount}
              </span>
            </div>
          </Card>

          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Cancelled</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {cancelledCount}
              </span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Upcoming Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
              <h2 className="text-base font-bold text-white tracking-tight">Upcoming Reservations</h2>
              <Link href="/dashboard/customer/bookings" className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors">
                View all bookings
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <div className="py-12 border border-neutral-900 border-dashed rounded-2xl text-center text-neutral-500 text-xs">
                  No upcoming reservations. Discover premium restaurants and book a table!
                </div>
              ) : (
                upcomingBookings.slice(0, 3).map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewDetails={setSelectedBooking}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Col: Recent Activity & Favorites */}
          <div className="space-y-8">
            {/* Activity Block */}
            <div className="space-y-4">
              <div className="border-b border-neutral-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Recent Activity</h2>
              </div>
              
              <Card variant="glass" className="p-5 border-neutral-900">
                <ul className="space-y-4">
                  {activityLogs.map((log, idx) => (
                    <li key={idx} className="flex gap-3 text-xs items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-neutral-300 font-medium">{log.text}</p>
                        <span className="text-[10px] text-neutral-500 font-semibold">{log.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Quick Favorites summary */}
            <div className="space-y-4">
              <div className="border-b border-neutral-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Favorites Shortcut</h2>
              </div>
              <Card variant="glass" className="p-4 border-neutral-900 flex items-center gap-3">
                <Heart className="text-red-500 fill-current shrink-0" size={16} />
                <div className="text-xs">
                  <p className="text-neutral-300 font-semibold">L'Ambroisie</p>
                  <p className="text-neutral-500 text-[10px] font-medium">Manhattan, NY</p>
                </div>
                <Link href="/restaurants/rest-1" className="text-xs text-amber-500 font-semibold hover:text-amber-400 ml-auto cursor-pointer">
                  Book
                </Link>
              </Card>
            </div>
          </div>
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
                <p className="text-neutral-300 italic font-sans">"{selectedBooking.specialRequests}"</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
