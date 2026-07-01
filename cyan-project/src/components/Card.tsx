import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'stat';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-2xl border transition-all duration-300 overflow-hidden';
  
  const variants = {
    default: 'bg-neutral-900 border-neutral-800 text-white',
    glass: 'bg-neutral-950/40 backdrop-blur-xl border-neutral-800/80 text-white shadow-xl',
    stat: 'bg-neutral-950 border-neutral-800 text-white p-6'
  };

  const hoverStyle = hoverEffect
    ? 'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/5 hover:border-neutral-700'
    : '';

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
