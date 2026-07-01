'use client';

import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, XCircle, Users, Check, X, ShieldAlert } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Booking } from '@/types';

export default function OwnerReservations() {
  const { restaurants, bookings, updateBookingStatus, tables, currentUser } = useAppState();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');

  // Assign Table Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedTableNum, setSelectedTableNum] = useState('');

  // Owned restaurants
  const ownedRestaurants = restaurants.filter(r => r.ownerId === currentUser?.id || r.ownerId === 'usr-2');
  const ownedIds = ownedRestaurants.map(r => r.id);

  // Filter owned reservations
  const ownedBookings = bookings.filter(b => ownedIds.includes(b.restaurantId));
  const filteredList = ownedBookings.filter(b => b.status === activeTab);

  // Filter available tables for assignment matching selected booking's restaurant
  const matchingTables = tables.filter(t => t.restaurantId === selectedBooking?.restaurantId && t.status === 'available');

  const handleOpenConfirmModal = (booking: Booking) => {
    setSelectedBooking(booking);
    
    // Suggest first available table matching capacity
    const match = tables.find(t => t.restaurantId === booking.restaurantId && t.status === 'available' && t.capacity >= booking.guests);
    setSelectedTableNum(match ? match.number : '');
    setAssignModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    updateBookingStatus(selectedBooking.id, 'confirmed', selectedTableNum || undefined);
    setAssignModalOpen(false);
    setSelectedBooking(null);
    alert(`Reservation accepted. Table ${selectedTableNum || 'unassigned'} linked.`);
  };

  const handleUpdateStatus = (bookingId: string, status: Booking['status']) => {
    if (confirm(`Are you sure you want to mark this booking as ${status}?`)) {
      updateBookingStatus(bookingId, status);
      alert(`Booking updated to ${status}.`);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: (b: Booking) => (
        <span className="font-mono text-xs text-neutral-500 font-bold">#{b.id}</span>
      )
    },
    {
      header: 'Customer',
      accessor: (b: Booking) => (
        <div className="space-y-1">
          <div>
            <div className="font-semibold text-white">{b.customerName}</div>
            <div className="text-[10px] text-neutral-500">{b.customerEmail} • {b.customerPhone}</div>
          </div>
          {b.specialRequests && (
            <div className="text-[10px] text-neutral-400 italic bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900 w-fit max-w-[200px] truncate" title={b.specialRequests}>
              Note: "{b.specialRequests}"
            </div>
          )}
          {b.preOrderItems && b.preOrderItems.length > 0 && (
            <div className="text-[10px] text-amber-400 font-medium bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 w-fit flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Pre-order: {b.preOrderItems.reduce((sum, item) => sum + item.quantity, 0)} items (${b.preOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)})</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Restaurant',
      accessor: (b: Booking) => (
        <div className="text-neutral-300 font-semibold text-xs">{b.restaurantName}</div>
      )
    },
    {
      header: 'Date & Time',
      accessor: (b: Booking) => (
        <div className="text-xs text-neutral-400 font-medium space-y-0.5">
          <div>{b.date}</div>
          <div className="text-neutral-550 font-mono">{b.time}</div>
        </div>
      )
    },
    {
      header: 'Guests',
      accessor: (b: Booking) => (
        <span className="font-bold text-neutral-400 text-xs">{b.guests} Pax</span>
      )
    },
    {
      header: 'Table',
      accessor: (b: Booking) => (
        b.tableNumber ? (
          <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-[10px] text-amber-400 font-bold">
            Table {b.tableNumber}
          </span>
        ) : (
          <span className="text-xs text-neutral-600 font-light italic">None</span>
        )
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      accessor: (b: Booking) => (
        <div className="flex justify-end gap-2">
          {b.status === 'pending' && (
            <>
              <button
                onClick={() => handleOpenConfirmModal(b)}
                className="p-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 transition-all cursor-pointer"
                title="Accept / Link Table"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                title="Reject Request"
              >
                <X size={12} />
              </button>
            </>
          )}

          {b.status === 'confirmed' && (
            <>
              <button
                onClick={() => handleUpdateStatus(b.id, 'completed')}
                className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 text-[10px] font-bold rounded-lg cursor-pointer transition-all"
              >
                Complete
              </button>
              <button
                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                title="Cancel Reservation"
              >
                <X size={12} />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8 font-sans text-neutral-200">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Reservation Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Confirm, modify, and monitor customer fine dining schedules.
          </p>
        </div>

        {/* Status Tab list */}
        <div className="flex border-b border-neutral-900 pb-px gap-6">
          {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold uppercase tracking-wider relative transition-colors cursor-pointer capitalize ${
                activeTab === tab ? 'text-amber-500 font-extrabold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab} ({ownedBookings.filter(b => b.status === tab).length})
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Reservations Table Grid */}
        <Table
          data={filteredList}
          columns={columns}
          emptyMessage={`No ${activeTab} reservation listings matched.`}
        />
      </div>

      {/* Assign Table & Confirm Modal */}
      {selectedBooking && (
        <Modal
          isOpen={assignModalOpen}
          onClose={() => { setAssignModalOpen(false); setSelectedBooking(null); }}
          title="Confirm Reservation & Link Seating Table"
        >
          <form onSubmit={handleConfirmReservation} className="space-y-5 text-xs text-neutral-300 font-sans">
            <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-2">
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Diner Client</span>
                <span className="font-bold text-white">{selectedBooking.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-900 pb-2">
                <span>Guests Requested</span>
                <span className="font-bold text-white">{selectedBooking.guests} Pax</span>
              </div>
              <div className="flex justify-between">
                <span>Requested Schedule</span>
                <span className="font-bold text-white font-mono">{selectedBooking.date} @ {selectedBooking.time}</span>
              </div>
              
              {selectedBooking.specialRequests && (
                <div className="border-t border-neutral-900 pt-2 text-[10px]">
                  <span className="text-neutral-500 font-bold block mb-0.5">Special Requests:</span>
                  <span className="text-neutral-300 italic">"{selectedBooking.specialRequests}"</span>
                </div>
              )}

              {selectedBooking.preOrderItems && selectedBooking.preOrderItems.length > 0 && (
                <div className="border-t border-neutral-900 pt-2 space-y-1">
                  <span className="text-neutral-500 font-bold block mb-0.5">Pre-Ordered Menu:</span>
                  {selectedBooking.preOrderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-neutral-300 text-[10px]">
                      <span>{item.name} (x{item.quantity})</span>
                      <span className="font-mono">${item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-neutral-900/50 text-[10px]">
                    <span>Pre-Order Total</span>
                    <span>${selectedBooking.preOrderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">Link Table</label>
              <select
                value={selectedTableNum}
                onChange={e => setSelectedTableNum(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-white p-2.5 rounded-lg outline-none"
              >
                <option value="">No Table (Confirm without seating)</option>
                {tables
                  .filter(t => t.restaurantId === selectedBooking.restaurantId)
                  .map(t => (
                    <option key={t.id} value={t.number}>
                      Table #{t.number} (Capacity: {t.capacity} Pax, Status: {t.status})
                    </option>
                  ))}
              </select>
            </div>

            <Button type="submit" variant="primary" fullWidth className="py-2.5">
              Confirm Reservation
            </Button>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
