import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
