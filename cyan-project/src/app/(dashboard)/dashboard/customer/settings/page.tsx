'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function CustomerSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [calendarSync, setCalendarSync] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout role="customer">
      <div className="max-w-3xl space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Portal Settings
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Manage your notification methods and synced third-party integrations.
          </p>
        </div>

        <Card variant="glass" className="p-8 border-neutral-850">
          <form onSubmit={handleSave} className="space-y-6">
            {isSaved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check size={14} />
                Portal preferences synced successfully.
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-900 pb-2">
                Reservation Notifications
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={e => setEmailAlerts(e.target.checked)}
                    className="accent-amber-500 rounded border-neutral-800 bg-neutral-950 mt-0.5"
                  />
                  <div>
                    <span className="block text-xs font-bold text-neutral-200">Email Confirmation Updates</span>
                    <span className="block text-[10px] text-neutral-500 leading-tight">
                      Receive copy details, changes, and digital invoices in your email.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={e => setSmsAlerts(e.target.checked)}
                    className="accent-amber-500 rounded border-neutral-800 bg-neutral-950 mt-0.5"
                  />
                  <div>
                    <span className="block text-xs font-bold text-neutral-200">SMS Reminders</span>
                    <span className="block text-[10px] text-neutral-500 leading-tight">
                      Receive SMS reminder messages two hours before dining schedule.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-900">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs border-b border-neutral-900 pb-2">
                External Integrations
              </h3>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={calendarSync}
                  onChange={e => setCalendarSync(e.target.checked)}
                  className="accent-amber-500 rounded border-neutral-800 bg-neutral-950 mt-0.5"
                />
                <div>
                  <span className="block text-xs font-bold text-neutral-200">Google Calendar Sync</span>
                  <span className="block text-[10px] text-neutral-500 leading-tight">
                    Automatically sync confirmed reservations directly into your Google Calendar schedules.
                  </span>
                </div>
              </label>
            </div>

            <Button type="submit" variant="primary" className="py-2.5 px-6">
              Sync Preferences
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
