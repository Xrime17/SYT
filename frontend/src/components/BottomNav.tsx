'use client';

import React from 'react';
import Link from 'next/link';

export interface BottomNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className = '' }: BottomNavProps) {
  return (
    <nav
      className={`
        flex items-center justify-around safe-area-pb
        h-14 px-2 border-t border-[var(--syt-border)] bg-[var(--syt-surface)]/80 backdrop-blur-xl
        ${className}
      `}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium rounded-lg mx-1 gap-1
            transition-colors
            ${item.active
              ? 'text-[var(--syt-accent-glow)]'
              : 'text-[var(--syt-text-muted)] hover:text-[var(--syt-text-secondary)]'
            }
          `}
          aria-current={item.active ? 'page' : undefined}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
