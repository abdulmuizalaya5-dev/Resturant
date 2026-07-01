'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle2, Lock, FileText, Download, ShieldAlert, Award } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';

export default function CustomerBilling() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, bookings } = useAppState();

  // Add Card Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Card Number formatting (adds spacing every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Handle Expiry formatting (adds '/' after 2 digits)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardExpiry(value);
  };

  // Handle CVV validation
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardCvv(value);
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.replace(/\s+/g, '').length < 15 || cardExpiry.length < 5 || cardCvv.length < 3) {
      alert('Please fill out all card details correctly.');
      return;
    }

    addPaymentMethod({
      name: cardName,
      number: cardNumber,
      expiry: cardExpiry
    });

    // Reset Form
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setModalOpen(false);

    setSuccessMsg('Credit card saved successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDownloadInvoice = (bookingId: string, restaurantName: string) => {
    alert(`Generating invoice PDF for booking #${bookingId.toUpperCase()} at ${restaurantName}. Download will start shortly...`);
  };

  const getBrandBadgeColor = (brand: string) => {
    switch (brand) {
      case 'visa':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'mastercard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'amex':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'discover':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-8 font-sans text-neutral-200">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
              Payment Methods
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Manage your saved credit cards, billing profiles, and dining invoices.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="h-fit">
            <Plus size={16} className="mr-1.5" />
            Add Payment Card
          </Button>
        </div>

        {/* Saved Cards Section */}
        <div className="space-y-4">
          <div className="border-b border-neutral-900 pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Saved Cards</h2>
          </div>

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 max-w-lg animate-fade-in">
              <CheckCircle2 size={15} />
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.length === 0 ? (
              <div className="col-span-full py-16 border border-neutral-900 border-dashed rounded-3xl text-center text-neutral-500 text-xs space-y-2">
                <CreditCard size={32} className="mx-auto text-neutral-700 animate-pulse" />
                <p className="font-semibold text-neutral-400">No Saved Cards</p>
                <p className="text-neutral-550 max-w-xs mx-auto leading-relaxed">Add a payment card to quickly authorize signature menu pre-orders and premium dining table slots.</p>
              </div>
            ) : (
              paymentMethods.map((card) => (
                <Card
                  key={card.id}
                  variant="glass"
                  className={`p-6 border flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 ${
                    card.isDefault
                      ? 'border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-neutral-950/40 shadow-lg shadow-amber-500/2'
                      : 'border-neutral-900/60 hover:border-neutral-800'
                  }`}
                >
                  {/* Card Background Overlay */}
                  <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-white">
                    <CreditCard size={180} />
                  </div>

                  <div className="flex justify-between items-start z-10">
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest border ${getBrandBadgeColor(card.brand)}`}>
                        {card.brand}
                      </span>
                      {card.isDefault && (
                        <span className="ml-2 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest border border-amber-500/20 bg-amber-500/10 text-amber-400">
                          Default
                        </span>
                      )}
                    </div>
                    
                    {/* Expiry and actions */}
                    <div className="flex items-center gap-1">
                      {!card.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentMethod(card.id)}
                          className="px-2 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-lg text-[9px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => removePaymentMethod(card.id)}
                        className="p-2 text-neutral-500 hover:text-red-400 rounded-lg bg-neutral-950/40 border border-neutral-900 hover:border-red-500/10 hover:bg-red-500/5 transition-all cursor-pointer"
                        title="Remove Card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 z-10">
                    {/* Card number representation */}
                    <p className="text-xl font-mono text-white tracking-widest font-extrabold">
                      •••• •••• •••• {card.last4}
                    </p>

                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <span className="block text-[8px] uppercase font-bold text-neutral-500 tracking-wider">Cardholder</span>
                        <span className="font-bold text-white truncate max-w-[150px] block">{card.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] uppercase font-bold text-neutral-500 tracking-wider">Expires</span>
                        <span className="font-mono text-neutral-300 font-bold">{card.expiry}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Past Receipts & Invoices */}
        <div className="space-y-4">
          <div className="border-b border-neutral-900 pb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Billing History & Invoices</h2>
          </div>

          <Card variant="glass" className="overflow-hidden border-neutral-900/60 p-0">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-900 text-xs">
                <thead className="bg-neutral-950 text-neutral-500 uppercase tracking-widest font-bold text-[9px]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left">Invoice Ref</th>
                    <th scope="col" className="px-6 py-4 text-left">Restaurant</th>
                    <th scope="col" className="px-6 py-4 text-left">Date / Slot</th>
                    <th scope="col" className="px-6 py-4 text-left">Guests</th>
                    <th scope="col" className="px-6 py-4 text-left">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 bg-neutral-900/10">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-neutral-400">
                          #{booking.id.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          {booking.restaurantName}
                        </td>
                        <td className="px-6 py-4 text-neutral-400">
                          {booking.date} @ {booking.time}
                        </td>
                        <td className="px-6 py-4 text-neutral-400">
                          {booking.guests} pax
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider border ${
                            booking.status === 'confirmed' || booking.status === 'completed'
                              ? 'bg-green-500/10 border-green-500/20 text-green-400'
                              : booking.status === 'pending'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-red-500/10 border-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDownloadInvoice(booking.id, booking.restaurantName)}
                            className="p-1.5 rounded-lg border border-neutral-850 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 bg-neutral-950/40 hover:bg-amber-500/5 transition-all cursor-pointer inline-flex items-center gap-1.5"
                            title="Download Receipt"
                          >
                            <Download size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-neutral-500 italic">
                        No transactions found. Book fine dining tables to generate invoices.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Add Card Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Saved Credit Card" maxWidth="md">
          <form onSubmit={handleAddCardSubmit} className="space-y-4 text-left text-xs">
            
            <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-400 rounded-xl flex gap-2">
              <Lock size={16} className="shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-light">
                All card details are simulated and secure. Never enter actual real-life payment card information here.
              </p>
            </div>

            <Input
              label="Cardholder Full Name"
              placeholder="e.g. Sarah Jenkins"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              required
            />

            <Input
              label="Credit Card Number"
              placeholder="4111 2222 3333 4444"
              value={cardNumber}
              onChange={handleCardNumberChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={handleExpiryChange}
                required
              />
              <Input
                label="CVV Code"
                placeholder="123"
                type="password"
                value={cardCvv}
                onChange={handleCvvChange}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth className="py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-black text-xs uppercase tracking-widest">
                Save Credit Card
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
}
