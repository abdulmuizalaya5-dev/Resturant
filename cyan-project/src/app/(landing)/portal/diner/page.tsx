'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, ArrowLeft, User } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GoogleSignIn } from '@/components/GoogleSignIn';

export default function DinerLoginPage() {
  const router = useRouter();
  const { login } = useAppState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Visual mock field for diners
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        email,
        role: 'customer'
      });

      setLoading(false);
      if (result.success) {
        router.push('/dashboard/customer');
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
    setEmail('sarah.j@example.com');
    setPassword('customer123');
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
        <div className="mx-auto w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl">
          <User size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white leading-none">Dining Guest Sign In</h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
          Log in with your registered dining email to search tables, write reviews, and manage bookings.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="glass" className="p-8 space-y-6 border-blue-500/10 shadow-blue-500/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="diner@example.com"
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

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="py-2.5 mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-blue-400/20 focus:ring-blue-500/50">
              {loading ? 'Verifying...' : 'Sign In as Guest'}
            </Button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute w-full border-t border-neutral-900" />
            <span className="relative px-3 bg-neutral-950 text-[10px] uppercase font-bold tracking-wider text-neutral-600">
              Or continue with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <GoogleSignIn
              role="customer"
              onError={(err) => setError(err)}
            />
            <button
              type="button"
              className="flex items-center justify-center py-2 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-semibold hover:bg-neutral-850 cursor-pointer transition-colors text-neutral-400"
            >
              <span>Apple ID</span>
            </button>
          </div>

          {/* Demo Credentials Quick Match */}
          <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
            <span className="block text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
              Demo Diner Quick-Fill:
            </span>
            <div>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="text-[10px] w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-blue-500/40 text-neutral-300 hover:text-white rounded font-medium transition-colors cursor-pointer text-center"
              >
                Sarah Jenkins (sarah.j@example.com)
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-neutral-500">
            <span>New to CyanReserve? </span>
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Create a Dining Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
