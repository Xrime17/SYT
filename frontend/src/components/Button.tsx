import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 px-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 active:scale-[0.98]';
  const variants = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-400',
    secondary:
      'bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/80 shadow-sm hover:bg-white hover:border-slate-300 hover:shadow',
    danger:
      'bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:from-red-600 hover:to-red-500',
    ghost:
      'text-slate-600 hover:bg-white/60 hover:text-slate-900 border border-transparent hover:border-slate-200/80',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
