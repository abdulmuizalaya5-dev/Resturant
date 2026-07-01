'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Heart,
  User,
  Settings,
  LogOut,
  Building2,
  Grid3X3,
  BookOpen,
  Users,
  BarChart3,
  ChefHat,
  CreditCard
} from 'lucide-react';
import { useAppState } from '@/services/appState';

interface SidebarProps {
  role: 'customer' | 'owner' | 'admin' | 'worker';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const { logout, currentUser } = useAppState();

  const getCustomerLinks = () => [
    { label: 'Dashboard', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarDays },
    { label: 'Payment Methods', href: '/dashboard/customer/billing', icon: CreditCard },
    { label: 'Favorites', href: '/dashboard/customer/favorites', icon: Heart },
    { label: 'Profile', href: '/dashboard/customer/profile', icon: User },
    { label: 'Settings', href: '/dashboard/customer/settings', icon: Settings },
  ];

  const getOwnerLinks = () => [
    { label: 'Overview', href: '/dashboard/owner', icon: LayoutDashboard },
    { label: 'Restaurants', href: '/dashboard/owner/restaurants', icon: Building2 },
    { label: 'Tables', href: '/dashboard/owner/tables', icon: Grid3X3 },
    { label: 'Reservations', href: '/dashboard/owner/reservations', icon: BookOpen },
    { label: 'Customers', href: '/dashboard/owner/customers', icon: Users },
    { label: 'Analytics', href: '/dashboard/owner/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/owner/settings', icon: Settings },
  ];

  const getWorkerLinks = () => {
    const base = [
      { label: 'Overview', href: '/dashboard/owner', icon: LayoutDashboard },
    ];
    
    const assigned = currentUser?.assignedComponent;
    if (assigned === 'restaurants') {
      base.push({ label: 'Restaurants', href: '/dashboard/owner/restaurants', icon: Building2 });
    } else if (assigned === 'tables') {
      base.push({ label: 'Tables', href: '/dashboard/owner/tables', icon: Grid3X3 });
    } else if (assigned === 'reservations') {
      base.push({ label: 'Reservations', href: '/dashboard/owner/reservations', icon: BookOpen });
      base.push({ label: 'Customers', href: '/dashboard/owner/customers', icon: Users });
    } else if (assigned === 'analytics') {
      base.push({ label: 'Analytics', href: '/dashboard/owner/analytics', icon: BarChart3 });
    }
    
    base.push({ label: 'Settings', href: '/dashboard/owner/settings', icon: Settings });
    return base;
  };

  const getAdminLinks = () => [
    { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Restaurants', href: '/dashboard/admin/restaurants', icon: Building2 },
    { label: 'Bookings', href: '/dashboard/admin/bookings', icon: BookOpen },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const getLinks = () => {
    switch (role) {
      case 'owner':
        return getOwnerLinks();
      case 'worker':
        return getWorkerLinks();
      case 'admin':
        return getAdminLinks();
      case 'customer':
      default:
        return getCustomerLinks();
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 shrink-0 bg-neutral-950 border-r border-neutral-900 flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-neutral-900">
        <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-neutral-950 font-bold">
          <ChefHat size={20} />
        </div>
        <div>
          <span className="text-lg font-bold text-white font-sans tracking-tight">CyanReserve</span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-500 leading-none">
            {role} Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-amber-400' : 'text-neutral-500'} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-neutral-900">
        <Link href="/" onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer w-full text-left">
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
};
