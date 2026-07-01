'use client';

import React from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Table } from '@/components/Table';

export default function OwnerCustomers() {
  const { bookings, restaurants, currentUser } = useAppState();

  // Filter owned restaurants
  const ownedRestaurants = restaurants.filter(r => r.ownerId === currentUser?.id || r.ownerId === 'usr-2');
  const ownedIds = ownedRestaurants.map(r => r.id);

  // Bookings for owned restaurants
  const ownedBookings = bookings.filter(b => ownedIds.includes(b.restaurantId));

  // Build unique customers list
  const customersMap: Record<string, {
    name: string;
    email: string;
    phone: string;
    bookingCount: number;
    lastVisit: string;
  }> = {};

  ownedBookings.forEach(b => {
    if (!customersMap[b.customerId]) {
      customersMap[b.customerId] = {
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone,
        bookingCount: 0,
        lastVisit: b.date
      };
    }
    customersMap[b.customerId].bookingCount += 1;
    // Keep most recent date
    if (new Date(b.date) > new Date(customersMap[b.customerId].lastVisit)) {
      customersMap[b.customerId].lastVisit = b.date;
    }
  });

  const customersList = Object.values(customersMap);

  const columns = [
    {
      header: 'Name',
      accessor: (c: typeof customersList[0]) => (
        <div className="font-semibold text-white">{c.name}</div>
      )
    },
    {
      header: 'Email',
      accessor: (c: typeof customersList[0]) => (
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-light">
          <Mail size={12} className="text-neutral-500 shrink-0" />
          <span>{c.email}</span>
        </div>
      )
    },
    {
      header: 'Phone Number',
      accessor: (c: typeof customersList[0]) => (
        <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-light">
          <Phone size={12} className="text-neutral-500 shrink-0" />
          <span>{c.phone}</span>
        </div>
      )
    },
    {
      header: 'Reservations Count',
      accessor: (c: typeof customersList[0]) => (
        <div className="flex items-center gap-1.5 text-neutral-300 font-bold text-xs">
          <Calendar size={12} className="text-neutral-500 shrink-0" />
          <span>{c.bookingCount} visits</span>
        </div>
      )
    },
    {
      header: 'Last Dining Schedule',
      accessor: (c: typeof customersList[0]) => (
        <span className="text-xs text-neutral-400 font-medium font-mono">{c.lastVisit}</span>
      )
    }
  ];

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8 font-sans text-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Diner Database
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Review client contact lists and aggregate reservation statistics.
          </p>
        </div>

        <Table
          data={customersList}
          columns={columns}
          emptyMessage="No unique diner clients records linked yet."
        />
      </div>
    </DashboardLayout>
  );
}
