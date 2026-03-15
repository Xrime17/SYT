'use client';

import React from 'react';
import Link from 'next/link';

export interface NavTabItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface NavTabsProps {
  items: NavTabItem[];
  className?: string;
}

export function NavTabs({ items, className = '' }: NavTabsProps) {
  return (
    <nav className={`flex items-center gap-1 ${className}`}>
      {items.map((item) =>
        item.active ? (
          <span
            key={item.href}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-[var(--syt-accent)] text-white"
            aria-current="page"
          >
            {item.label}
          </span>
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--syt-text-secondary)] hover:bg-[var(--syt-glass-bg)] hover:text-[var(--syt-text)] transition-colors"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
