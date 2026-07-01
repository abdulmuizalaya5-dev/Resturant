'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, Users, Store, Check, X, Clock, HelpCircle } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';

export default function OwnerDashboard() {
  const { restaurants, bookings, updateBookingStatus, currentUser } = useAppState();

  // Filter owned restaurants
  const ownedRestaurants = restaurants.filter(r => r.ownerId === currentUser?.id || r.ownerId === 'usr-2');
  const ownedIds = ownedRestaurants.map(r => r.id);

  // Filter bookings for owned restaurants
  const ownedBookings = bookings.filter(b => ownedIds.includes(b.restaurantId));
  const pendingBookings = ownedBookings.filter(b => b.status === 'pending');
  const confirmedBookings = ownedBookings.filter(b => b.status === 'confirmed');

  // Calculate statistics
  const totalBookings = ownedBookings.length;
  // Estimate revenue based on guests ($60 average spend per guest in fine dining)
  const totalRevenue = ownedBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => {
      const preOrderSum = b.preOrderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
      return sum + (b.guests * 75) + preOrderSum;
    }, 0);

  const uniqueCustomersCount = Array.from(new Set(ownedBookings.map(b => b.customerId))).length;

  const handleStatusUpdate = (bookingId: string, status: 'confirmed' | 'cancelled') => {
    updateBookingStatus(bookingId, status);
    alert(`Booking ${bookingId} has been ${status === 'confirmed' ? 'accepted' : 'cancelled'}.`);
  };

  const columns = [
    {
      header: 'Customer',
      accessor: (b: typeof bookings[0]) => (
        <div className="font-semibold text-white">{b.customerName}</div>
      )
    },
    {
      header: 'Restaurant',
      accessor: (b: typeof bookings[0]) => (
        <div className="text-neutral-400 font-medium">{b.restaurantName}</div>
      )
    },
    {
      header: 'Schedule',
      accessor: (b: typeof bookings[0]) => (
        <div className="text-xs text-neutral-400 space-y-0.5">
          <div className="font-semibold text-neutral-300">{b.date}</div>
          <div className="text-neutral-500 font-mono">{b.time}</div>
        </div>
      )
    },
    {
      header: 'Guests',
      accessor: (b: typeof bookings[0]) => (
        <div className="font-bold text-neutral-400">{b.guests} Pax</div>
      )
    },
    {
      header: 'Status',
      accessor: (b: typeof bookings[0]) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock size={10} className="animate-pulse" />
          Pending
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (b: typeof bookings[0]) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleStatusUpdate(b.id, 'confirmed')}
            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 transition-all cursor-pointer"
            title="Accept Booking"
          >
            <Check size={14} />
          </button>
          <button
            onClick={() => handleStatusUpdate(b.id, 'cancelled')}
            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            title="Reject Booking"
          >
            <X size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8 font-sans">
        {/* Welcome row */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Console Overview
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Restaurant Owner Dashboard • Live Table Stream
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Total Bookings</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {totalBookings}
              </span>
            </div>
          </Card>

          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Est. Revenue</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
          </Card>

          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0">
              <Users size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Active Diners</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {uniqueCustomersCount}
              </span>
            </div>
          </Card>

          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl shrink-0">
              <Store size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">My Restaurants</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {ownedRestaurants.length}
              </span>
            </div>
          </Card>
        </div>

        {/* Pending Requests Stream */}
        <div className="space-y-4">
          <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Clock size={16} className="text-amber-500 shrink-0" />
              Pending Reservations Stream
            </h2>
            <Link href="/dashboard/owner/reservations" className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors">
              Manage all reservations
            </Link>
          </div>

          <Table
            data={pendingBookings}
            columns={columns}
            emptyMessage="No pending reservation requests stream current."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
