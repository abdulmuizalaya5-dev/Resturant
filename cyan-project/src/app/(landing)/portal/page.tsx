'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, Shield, ArrowLeft, Key, UserCheck, Building2, User } from 'lucide-react';
import { Card } from '@/components/Card';

export default function PortalSelectionPage() {
  const portals = [
    {
      title: 'Dining Guest',
      role: 'Diner Portal',
      description: 'Secure fine dining tables, view menus, and manage your personal reservations.',
      icon: User,
      href: '/portal/diner',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/50 text-blue-400',
      iconBg: 'bg-blue-500/10 text-blue-400'
    },
    {
      title: 'Restaurant Staff',
      role: 'Staff Worker Portal',
      description: 'Check guest lists, manage table status, and coordinate reservation shifts.',
      icon: UserCheck,
      href: '/portal/staff',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50 text-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-400'
    },
    {
      title: 'Restaurant Owner',
      role: 'Owner Management Console',
      description: 'Configure seating layouts, adjust dining pricing, and review performance analytics.',
      icon: Building2,
      href: '/portal/owner',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50 text-purple-400',
      iconBg: 'bg-purple-500/10 text-purple-400'
    },
    {
      title: 'Platform Control',
      role: 'System Administrator Hub',
      description: 'Provision staff security keys, control permissions, and manage platform databases.',
      icon: Shield,
      href: '/portal/admin',
      color: 'from-red-500/10 to-rose-500/10 border-red-500/20 hover:border-red-500/50 text-red-400',
      iconBg: 'bg-red-500/10 text-red-400'
    }
  ];

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans text-neutral-200">
      {/* Absolute Back Link */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-white transition-colors cursor-pointer bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-850">
        <ArrowLeft size={12} />
        <span>Back to Home</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-4 mb-10">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-neutral-950 font-bold">
            <ChefHat size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CyanReserve</span>
        </Link>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-white via-neutral-100 to-neutral-450 bg-clip-text text-transparent">
          Select Your Portal
        </h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Access the appropriate workspace dashboard by selecting your system authorization tier below.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link href={portal.href} key={portal.title} className="block group">
                <Card
                  variant="glass"
                  hoverEffect={true}
                  className={`p-6 h-full flex flex-col gap-4 border bg-gradient-to-br ${portal.color} transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${portal.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300 transition-colors">
                      Enter Portal &rarr;
                    </span>
                  </div>
                  <div className="space-y-1.5 flex-grow">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-450 transition-colors">
                      {portal.title}
                    </h3>
                    <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-widest leading-none">
                      {portal.role}
                    </span>
                    <p className="text-xs text-neutral-450 leading-relaxed pt-2">
                      {portal.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
