'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, logout } = useAppState();

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/portal';

  if (isAuthPage) return null; // Hide navbar on login/register/portal

  const getDashboardLink = (role: 'customer' | 'owner' | 'admin' | 'worker') => {
    switch (role) {
      case 'owner':
      case 'worker':
        return '/dashboard/owner';
      case 'admin':
        return '/dashboard/admin';
      case 'customer':
      default:
        return '/dashboard/customer';
    }
  };

  return (
    <nav className="h-20 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
        <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-neutral-950 font-bold group-hover:rotate-6 transition-transform">
          <ChefHat size={20} />
        </div>
        <div>
          <span className="text-lg font-bold text-white font-sans tracking-tight">CyanReserve</span>
          <span className="block text-[8px] font-bold text-amber-500 uppercase tracking-widest leading-none">
            Fine Dining
          </span>
        </div>
      </Link>

      {/* Main Links */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <Link href="/" className={`font-semibold cursor-pointer ${pathname === '/' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'}`}>
          Home
        </Link>
        <Link href="/restaurants" className={`font-semibold cursor-pointer ${pathname.startsWith('/restaurants') ? 'text-amber-400' : 'text-neutral-400 hover:text-white'}`}>
          Explore Restaurants
        </Link>
        <Link href="/#testimonials" className="font-semibold text-neutral-400 hover:text-white cursor-pointer">
          Testimonials
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <Link href={getDashboardLink(currentUser.role)} passHref>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex border-neutral-800 text-neutral-300 hover:bg-neutral-900">
                <LayoutDashboard size={14} className="mr-1.5" />
                Dashboard
              </Button>
            </Link>
            
            {/* User Dropdown/Profile Link */}
            <Link href={getDashboardLink(currentUser.role)} className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 group-hover:border-amber-500 transition-colors">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/portal/diner" passHref>
              <Button variant="outline" size="sm" className="border-neutral-850 text-neutral-300 hover:bg-neutral-900">
                Sign In
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
