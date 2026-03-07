import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 p-4 transition-shadow hover:shadow-xl hover:shadow-slate-200/60 ${className}`}
    >
      {children}
    </div>
  );
}
