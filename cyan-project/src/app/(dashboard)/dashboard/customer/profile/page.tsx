'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Check } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function CustomerProfile() {
  const { currentUser, updateProfile } = useAppState();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email, phone, avatar);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarChange = () => {
    // Quick demo avatar toggles
    const images = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    ];
    const currentIndex = images.indexOf(avatar);
    const nextIndex = (currentIndex + 1) % images.length;
    setAvatar(images[nextIndex]);
  };

  return (
    <DashboardLayout role="customer">
      <div className="max-w-3xl space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Diner Profile
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
            Edit your contact details and customize your profile preferences.
          </p>
        </div>

        <Card variant="glass" className="p-8 border-neutral-850">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSaved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check size={14} />
                Profile updated successfully.
              </div>
            )}

            {/* Avatar Column */}
            <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-neutral-900">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-neutral-800 bg-neutral-950">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-neutral-950 border border-neutral-950 cursor-pointer shadow-md group-hover:scale-105 transition-all"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-white text-base">Profile Photo</h4>
                <p className="text-xs text-neutral-500 max-w-sm">
                  Click the camera icon to cycle through sample photos. Updates reflect instantly across notifications.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Membership Tier
                </label>
                <div className="bg-neutral-950 border border-neutral-850 text-neutral-400 rounded-lg px-4 py-2.5 text-sm select-none">
                  🌟 CyanReserve Prestige
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" className="py-2.5 px-6">
              Save Profile Changes
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
