'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function OwnerSettings() {
  const [notifyOnBooking, setNotifyOnBooking] = useState(true);
  const [autoReleaseTables, setAutoReleaseTables] = useState(true);
  const [payoutSchedule, setPayoutSchedule] = useState('weekly');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout role="owner">
      <div className="max-w-3xl space-y-8 font-sans text-neutral-200">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Console Preferences
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Configure automated reservation rules, notifications, and payouts.
          </p>
        </div>

        <Card variant="glass" className="p-8 border-neutral-850">
          <form onSubmit={handleSave} className="space-y-6">
            {isSaved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check size={14} />
                Console configurations synchronized.
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-900 pb-2">
                Automation Rules
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOnBooking}
                    onChange={e => setNotifyOnBooking(e.target.checked)}
                    className="accent-amber-500 rounded border-neutral-850 bg-neutral-950 mt-0.5"
                  />
                  <div>
                    <span className="block text-xs font-bold text-neutral-200">Booking Alerts Stream</span>
                    <span className="block text-[10px] text-neutral-500 leading-tight">
                      Alert desktop notification sound and triggers instant emails when a diner requests a slot.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoReleaseTables}
                    onChange={e => setAutoReleaseTables(e.target.checked)}
                    className="accent-amber-500 rounded border-neutral-850 bg-neutral-950 mt-0.5"
                  />
                  <div>
                    <span className="block text-xs font-bold text-neutral-200">Auto-release Seating Occupancies</span>
                    <span className="block text-[10px] text-neutral-500 leading-tight">
                      Release tables to 'available' status 15 minutes after a booking schedule is complete.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-900">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-900 pb-2">
                Payout Settings
              </h3>
              
              <div className="flex flex-col">
                <label className="text-neutral-400 font-bold mb-2 text-[10px] uppercase tracking-wider">Payout Schedule</label>
                <select
                  value={payoutSchedule}
                  onChange={e => setPayoutSchedule(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-white p-2.5 rounded-lg text-xs outline-none max-w-xs"
                >
                  <option value="daily">Daily Transfers</option>
                  <option value="weekly">Weekly Rollups</option>
                  <option value="monthly">Monthly Cycles</option>
                </select>
              </div>
            </div>

            <Button type="submit" variant="primary" className="py-2.5 px-6">
              Save Preferences
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
