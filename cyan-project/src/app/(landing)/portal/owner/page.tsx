'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, ArrowLeft, Building2 } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function OwnerLoginPage() {
  const router = useRouter();
  const { login } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Visual mock field for owners
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your restaurant owner email address.');
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        email,
        role: 'owner'
      });

      setLoading(false);
      if (result.success) {
        router.push('/dashboard/owner');
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during authentication.');
    }
  };

  const handleQuickLogin = () => {
    setError('');
    setEmail('marco.rossi@ristorante.com');
    setPassword('owner123');
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans text-neutral-200 animate-fade-in">
      {/* Back to Portal selection */}
      <Link href="/portal" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-white transition-colors cursor-pointer bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-800">
        <ArrowLeft size={12} />
        <span>Back to Portal Selection</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Portal Indicator Icon */}
        <div className="mx-auto w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center rounded-2xl">
          <Building2 size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white leading-none">Restaurant Owner Sign In</h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
          Log in to your executive dashboard to configure menus, add tables, view analytics, and inspect overall sales.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="glass" className="p-8 space-y-6 border-purple-500/10 shadow-purple-500/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <div className="relative">
              <Input
                label="Owner Email Address"
                type="email"
                placeholder="owner@ristorante.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Mail size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Lock size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-neutral-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-amber-500 rounded border-neutral-800 bg-neutral-950" />
                <span>Remember session</span>
              </label>
              <a href="#" className="text-amber-500 hover:text-amber-400">Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="py-2.5 mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-purple-400/20 focus:ring-purple-500/50">
              {loading ? 'Verifying...' : 'Sign In as Owner'}
            </Button>
          </form>

          {/* Demo Credentials Quick Match */}
          <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
            <span className="block text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
              Demo Owner Quick-Fill:
            </span>
            <div>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="text-[10px] w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 text-neutral-350 hover:text-white rounded font-medium transition-colors cursor-pointer text-center"
              >
                Chef Marco Rossi (marco.rossi@ristorante.com)
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
