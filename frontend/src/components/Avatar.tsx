'use client';

import React from 'react';

export interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <span
      className={`
        inline-flex shrink-0 items-center justify-center rounded-full font-semibold
        bg-[var(--syt-accent)] text-white
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name ?? ''} className="w-full h-full rounded-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
