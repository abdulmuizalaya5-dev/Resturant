'use client';

import React from 'react';
import { Users, Store, Calendar, TrendingUp, ShieldCheck, Mail } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { User } from '@/types';

export default function AdminDashboard() {
  const { restaurants, bookings, users } = useAppState();

  const totalUsers = users.length;
  const totalRestaurants = restaurants.length;
  const totalBookings = bookings.length;
  
  // Platform fees ($5 platform commission fee per booked reservation)
  const platformRevenue = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length * 5;

  const userColumns = [
    {
      header: 'Name',
      accessor: (u: User) => (
        <div className="font-semibold text-white">{u.name}</div>
      )
    },
    {
      header: 'Email address',
      accessor: (u: User) => (
        <span className="text-neutral-450 text-xs font-light">{u.email}</span>
      )
    },
    {
      header: 'Role Tier',
      accessor: (u: User) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          u.role === 'admin'
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : u.role === 'owner'
            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {u.role}
        </span>
      )
    },
    {
      header: 'Primary Phone',
      accessor: (u: User) => (
        <span className="text-xs text-neutral-400 font-mono">{u.phone}</span>
      )
    }
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 font-sans text-neutral-200">
        {/* Title overview */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Platform Hub
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            System Administrator Hub • Global Metrics
          </p>
        </div>

        {/* Admin metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0">
              <Users size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">System Users</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {totalUsers}
              </span>
            </div>
          </Card>

          <Card variant="stat" className="flex items-center gap-4 border-neutral-850">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl shrink-0">
              <Store size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Restaurants</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                {totalRestaurants}
              </span>
            </div>
          </Card>

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
              <TrendingUp size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Platform Fees</span>
              <span className="text-2xl font-extrabold text-white leading-none mt-1 block">
                ${platformRevenue.toLocaleString()}
              </span>
            </div>
          </Card>
        </div>

        {/* Global Users roster summary */}
        <div className="space-y-4">
          <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-500" />
              Verified Accounts Roster
            </h2>
          </div>

          <Table
            data={users}
            columns={userColumns}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
