'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Sidebar } from './Sidebar';
import { Button } from './Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'customer' | 'owner' | 'admin' | 'worker';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const pathname = usePathname();
  const { currentUser } = useAppState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isWorkerRestricted = () => {
    if (currentUser?.role !== 'worker') return false;
    const assigned = currentUser.assignedComponent;
    if (pathname.includes('/restaurants') && assigned !== 'restaurants') return true;
    if (pathname.includes('/tables') && assigned !== 'tables') return true;
    if (pathname.includes('/reservations') && assigned !== 'reservations') return true;
    if (pathname.includes('/customers') && assigned !== 'reservations') return true;
    if (pathname.includes('/analytics') && assigned !== 'analytics') return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen sticky top-0">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar Backdrop & Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative flex-grow max-w-xs animate-slide-right h-full">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar role={role} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-neutral-950 border-b border-neutral-900 px-6 flex items-center justify-between sticky top-0 z-40">
          {/* Left Side: Navigation / Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
            >
              <Menu size={20} />
            </button>
            
            <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-850">
              <ArrowLeft size={12} />
              <span>Back to Marketplace</span>
            </Link>
          </div>

          {/* Right Side: User Profile */}
          <div className="flex items-center gap-4">
            {/* Profile Summary */}
            {currentUser && (
              <div className="flex items-center gap-3 pl-3 border-l border-neutral-900">
                <div className="text-right hidden md:block">
                  <span className="block text-sm font-bold text-white leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1 justify-end">
                    <span>{currentUser.role}</span>
                    {currentUser.role === 'worker' && currentUser.assignedComponent && (
                      <span className="text-[8px] text-amber-500 font-mono">({currentUser.assignedComponent})</span>
                    )}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 shrink-0">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content Outlet */}
        <main className="flex-1 p-6 md:p-8 bg-neutral-950/40 overflow-y-auto">
          {isWorkerRestricted() ? (
            <div className="max-w-md mx-auto py-16 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center rounded-2xl">
                <ShieldAlert size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white leading-none">Access Restricted</h2>
                <p className="text-sm text-neutral-400 leading-relaxed pt-2">
                  Your worker account is assigned to the <span className="text-amber-400 font-bold capitalize font-mono bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded">{currentUser?.assignedComponent}</span> department.
                </p>
                <p className="text-xs text-neutral-500 pt-1">
                  Contact your system administrator to adjust permission levels.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/dashboard/owner" passHref legacyBehavior>
                  <Button variant="outline">Back to Overview</Button>
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};
