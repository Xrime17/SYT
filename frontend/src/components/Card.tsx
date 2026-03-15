'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`syt-glass-card p-5 transition-shadow hover:shadow-[var(--syt-shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}
