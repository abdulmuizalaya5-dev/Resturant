'use client';

import React, { useEffect, useState } from 'react';
import { useAppState } from '@/services/appState';
import { useRouter } from 'next/navigation';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Loader2 } from 'lucide-react';

interface GoogleSignInProps {
  role?: 'customer' | 'owner';
  buttonText?: string;
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  role = 'customer',
  buttonText = 'Sign in with Google',
  onSuccess,
  onError,
}) => {
  const router = useRouter();
  const { loginWithGoogle } = useAppState();
  const [loading, setLoading] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  
  // Custom mock inputs
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    // Load Google GSI Client Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  const handleGoogleCredentialResponse = async (response: any) => {
    setLoading(true);
    try {
      const res = await loginWithGoogle({
        token: response.credential,
        isMock: false,
      });

      if (res.success && res.user) {
        if (onSuccess) onSuccess();
        // Redirect based on role
        if (res.user.role === 'owner') {
          router.push('/dashboard/owner');
        } else if (res.user.role === 'admin') {
          router.push('/portal/admin');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        if (onError) onError(res.error || 'Google Authentication failed.');
      }
    } catch (err) {
      if (onError) onError('Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    // If no client ID is provided in .env, fallback to a gorgeous mock Google Modal
    if (!clientId) {
      setShowMockModal(true);
      return;
    }

    try {
      if ((window as any).google) {
        (window as any).google.accounts.id.prompt();
      } else {
        setShowMockModal(true);
      }
    } catch (e) {
      setShowMockModal(true);
    }
  };

  // Mock account data
  const mockAccounts = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'customer'
    },
    {
      name: 'Chef Marco Rossi',
      email: 'owner@cyanreserve.com',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80',
      role: 'owner'
    },
    {
      name: 'Alexander Wright',
      email: 'admin@cyanreserve.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'admin'
    }
  ];

  const handleMockLogin = async (acc: typeof mockAccounts[0] | { name: string; email: string; avatar?: string; role: string }) => {
    setLoading(true);
    setShowMockModal(false);
    try {
      const res = await loginWithGoogle({
        email: acc.email,
        name: acc.name,
        avatar: acc.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isMock: true,
      });

      if (res.success && res.user) {
        if (onSuccess) onSuccess();
        // Redirect based on database user role or selection
        if (res.user.role === 'owner' || acc.role === 'owner') {
          router.push('/dashboard/owner');
        } else if (res.user.role === 'admin' || acc.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/customer');
        }
      } else {
        if (onError) onError(res.error || 'Mock Google login failed.');
      }
    } catch (err) {
      if (onError) onError('Mock Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockEmail || !mockName) return;
    handleMockLogin({
      name: mockName,
      email: mockEmail,
      role: role,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-2 px-3 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 w-full"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin text-amber-500" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        )}
        <span>{buttonText}</span>
      </button>

      {/* Mock Google Sign-In Dialog */}
      <Modal
        isOpen={showMockModal}
        onClose={() => setShowMockModal(false)}
        title="Sign in with Google"
      >
        <div className="text-center font-sans space-y-6 py-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white leading-none">Choose an account</h3>
            <p className="text-xs text-neutral-400">to continue to <span className="text-amber-500 font-semibold">CyanReserve</span></p>
          </div>

          {!isCustomMode ? (
            <div className="space-y-3">
              <div className="max-h-64 overflow-y-auto space-y-2.5 custom-scrollbar pr-1">
                {mockAccounts
                  .filter(acc => acc.role === role || acc.role === 'admin')
                  .map((acc, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleMockLogin(acc)}
                      className="w-full flex items-center gap-3.5 p-3.5 bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-850 hover:border-amber-500/20 rounded-2xl cursor-pointer text-left transition-all duration-300 group"
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-800 group-hover:border-amber-500/30"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white leading-none mb-1 group-hover:text-amber-400 transition-colors">
                          {acc.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-mono truncate">{acc.email}</p>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-neutral-600 px-2 py-0.5 border border-neutral-850 rounded-md group-hover:border-amber-500/20 group-hover:text-amber-400/80 transition-all font-mono">
                        {acc.role}
                      </span>
                    </button>
                  ))}
              </div>

              <div className="pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className="text-xs font-semibold text-amber-500 hover:text-amber-400 hover:underline cursor-pointer transition-colors"
                >
                  Use another mock account
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4 text-left animate-fade-in">
              <Input
                label="Full Name"
                type="text"
                placeholder="Google User Name"
                value={mockName}
                onChange={e => setMockName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="name@gmail.com"
                value={mockEmail}
                onChange={e => setMockEmail(e.target.value)}
                required
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setIsCustomMode(false)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  className="bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400"
                >
                  Continue
                </Button>
              </div>
            </form>
          )}

          <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
            To use a real Google account, configure <code className="text-amber-500/80 font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your env variables.
          </p>
        </div>
      </Modal>
    </>
  );
};
export default GoogleSignIn;
