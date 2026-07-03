'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GoogleSignIn } from '@/components/GoogleSignIn';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAppState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please complete all form fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(name, email, phone, role);
      setLoading(false);
      if (result.success) {
        if (role === 'owner') {
          router.push('/dashboard/owner');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        setError(result.error || 'Registration failed. User may already exist.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative font-sans text-neutral-200">
      {/* Absolute Back Link */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-white transition-colors cursor-pointer bg-neutral-900/60 px-3 py-1.5 rounded-lg border border-neutral-800">
        <ArrowLeft size={12} />
        <span>Back to Home</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Brand Header */}
        <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl text-neutral-950 font-bold">
            <ChefHat size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CyanReserve</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card variant="glass" className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <User size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Mail size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="relative">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <Phone size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            {/* Role Select Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Account Purpose
              </label>
              <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-1 border border-neutral-850 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                    role === 'customer'
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  I'm a Diner
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                    role === 'owner'
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  I'm an Owner
                </button>
              </div>
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Lock size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <Lock size={16} className="absolute right-3.5 top-[38px] text-neutral-500" />
            </div>

            <div className="flex items-center text-xs font-medium text-neutral-400 cursor-pointer gap-2">
              <input type="checkbox" required className="accent-amber-500 rounded border-neutral-800 bg-neutral-950" />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={loading} className="py-2.5 mt-2">
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          {/* Social Sign Up Divider */}
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute w-full border-t border-neutral-900" />
            <span className="relative px-3 bg-neutral-950 text-[10px] uppercase font-bold tracking-wider text-neutral-600">
              Or sign up with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <GoogleSignIn
              role={role}
              buttonText="Google"
              onError={(err) => setError(err)}
            />
            <button
              type="button"
              className="flex items-center justify-center py-2 px-3 bg-neutral-900 border border-neutral-805 rounded-xl text-xs font-semibold hover:bg-neutral-850 cursor-pointer transition-colors text-neutral-400"
            >
              <span>Apple ID</span>
            </button>
          </div>

          <div className="text-center text-xs text-neutral-500 border-t border-neutral-900 pt-4">
            <span>Already have an account? </span>
            <Link href="/login" className="text-amber-500 hover:text-amber-400 font-semibold">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
