'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/portal/diner');
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center font-sans text-neutral-400">
      <div className="text-center space-y-2">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
        <p className="text-sm font-medium text-neutral-300">Redirecting to dining portal...</p>
      </div>
    </div>
  );
}
