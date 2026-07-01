'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Key, ArrowLeft, UserCheck } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function StaffLoginPage() {
  const router = useRouter();
  const { login } = useAppState();

  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessKey) {
      setError('Please enter your worker access key.');
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        key: accessKey,
        role: 'worker'
      });

      setLoading(false);
      if (result.success) {
        router.push('/dashboard/owner'); // Workers dashboard utilizes the owner overview layout
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
    setAccessKey('cyan-staff-123');
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
        <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center rounded-2xl animate-pulse">
          <UserCheck size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white leading-none">Restaurant Staff Sign In</h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
          Log in with the custom worker access key assigned by your platform administrator.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="glass" className="p-8 space-y-6 border-amber-500/10 shadow-amber-500/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <div className="relative">
              <Input
                label="Worker Access Key"
                type="password"
                placeholder="Enter access key (e.g. cyan-staff-123)"
                value={accessKey}
                onChange={e => setAccessKey(e.target.value)}
                required
              />
              <Key size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-neutral-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-amber-500 rounded border-neutral-800 bg-neutral-950" />
                <span>Remember session</span>
              </label>
              <a href="#" className="text-amber-500 hover:text-amber-400">Request key reset</a>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold border-amber-400/20">
              {loading ? 'Verifying Credentials...' : 'Sign In as Staff'}
            </Button>
          </form>

          {/* Demo Credentials Quick Match */}
          <div className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
            <span className="block text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
              Demo Staff Quick-Fill:
            </span>
            <div>
              <button
                type="button"
                onClick={handleQuickLogin}
                className="text-[10px] w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-amber-500/45 text-neutral-350 hover:text-white rounded font-medium transition-colors cursor-pointer text-center"
              >
                Elena Rostova Key (cyan-staff-123)
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
