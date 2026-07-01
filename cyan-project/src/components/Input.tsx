import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && (
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-neutral-900 border ${
            error ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-800 focus:border-amber-500/80 focus:ring-amber-500/20'
          } text-white rounded-lg px-4 py-2.5 text-sm transition-all duration-300 outline-none focus:ring-4`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
