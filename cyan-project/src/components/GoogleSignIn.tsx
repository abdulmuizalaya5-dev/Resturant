'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAppState } from '@/services/appState';
import { useRouter } from 'next/navigation';
import { Modal } from './Modal';
import { Button } from './Button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface GoogleSignInProps {
  role?: 'customer' | 'owner';
  textType?: 'signin_with' | 'signup_with';
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  role = 'customer',
  textType = 'signin_with',
  onSuccess,
  onError,
}) => {
  const router = useRouter();
  const { loginWithGoogle } = useAppState();
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Load Google Identity Services SDK
  useEffect(() => {
    // We always load the script so we can check if it initializes correctly
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      setGsiLoaded(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize and Render Real Google Button when SDK is loaded and Client ID is available
  useEffect(() => {
    if (!gsiLoaded || !clientId || !buttonRef.current) return;

    try {
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false, // Prevents automatic login to allow account choosing
        });

        // Render the official Google Sign-In Button
        google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: buttonRef.current.offsetWidth || 340,
          text: textType, // 'signin_with' | 'signup_with'
          shape: 'pill',
        });
      }
    } catch (err) {
      console.error('Failed to initialize Google Sign-In Button:', err);
    }
  }, [gsiLoaded, clientId, textType]);

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
          router.push('/dashboard/admin');
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

  const handlePlaceholderClick = () => {
    setShowConfigModal(true);
  };

  return (
    <div className="w-full flex justify-center">
      {clientId ? (
        <div className="w-full flex flex-col items-center">
          {/* Container where the real Google button iframe will be rendered */}
          <div 
            ref={buttonRef} 
            className="w-full min-h-[44px] flex justify-center"
            id="google-signin-button-container"
          />
          {loading && (
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
              <Loader2 size={12} className="animate-spin text-amber-500" />
              <span>Authenticating with Google...</span>
            </div>
          )}
        </div>
      ) : (
        // Placeholder button to guide configuration if CLIENT ID is not set
        <button
          type="button"
          onClick={handlePlaceholderClick}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 text-neutral-300 hover:text-white rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 w-full"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>{textType === 'signin_with' ? 'Sign in with Google' : 'Sign up with Google'}</span>
        </button>
      )}

      {/* Google Sign-in Setup Help Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Google Auth Configuration Required"
      >
        <div className="font-sans space-y-5 py-2 text-left text-neutral-300">
          <div className="flex items-center gap-3 p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <AlertTriangle size={24} className="shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Real Google OAuth Client ID Not Found</p>
              <p className="opacity-90 mt-0.5">Please follow the steps below to connect your Google Developer Console account.</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-neutral-400">Step-by-Step Integration Guide</h4>
            
            <ol className="list-decimal list-inside space-y-2.5 leading-relaxed pl-1 text-neutral-400">
              <li>
                Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">Google Cloud Console</a>.
              </li>
              <li>
                Create a new project (e.g. <span className="text-white">CyanReserve</span>) or select an existing one.
              </li>
              <li>
                Navigate to <span className="text-white">APIs & Services</span> → <span className="text-white">OAuth Consent Screen</span>:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 opacity-80">
                  <li>Choose User Type: <span className="text-white">External</span>.</li>
                  <li>Fill in app details (name, developer email).</li>
                  <li>Under Scopes, add <code className="text-amber-500/80 font-mono">.../auth/userinfo.profile</code> and <code className="text-amber-500/80 font-mono">.../auth/userinfo.email</code>.</li>
                  <li>Add your email address as a <span className="text-white">Test User</span> (critical for development mode).</li>
                </ul>
              </li>
              <li>
                Navigate to <span className="text-white">Credentials</span> → <span className="text-white">Create Credentials</span> → <span className="text-white">OAuth Client ID</span>:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-1 opacity-80">
                  <li>Application Type: <span className="text-white">Web Application</span>.</li>
                  <li>Authorized JavaScript Origins: Add <code className="text-amber-500/80 font-mono">http://localhost:3000</code> and <code className="text-amber-500/80 font-mono">https://resturant-two-umber.vercel.app</code>.</li>
                  <li>Authorized Redirect URIs: Add those same URLs.</li>
                </ul>
              </li>
              <li>
                Copy the generated <span className="text-white">Client ID</span> (ends with <code className="text-neutral-500 text-[10px]">.apps.googleusercontent.com</code>).
              </li>
              <li>
                Add it to your <span className="text-white font-semibold">.env</span> file in the <code className="text-neutral-400 font-mono">cyan-project</code> directory:
                <pre className="bg-neutral-950 p-2 rounded-xl mt-1.5 border border-neutral-900 overflow-x-auto text-[10px] text-amber-400/90 font-mono">
                  NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id-here"
                </pre>
              </li>
            </ol>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowConfigModal(false)}
              className="bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 px-6"
            >
              I Understand
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default GoogleSignIn;
