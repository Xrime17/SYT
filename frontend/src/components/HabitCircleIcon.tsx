'use client';

import type { HabitIconKey } from '@/api/habits';

const isKey = (k: string): k is HabitIconKey =>
  k === 'water' ||
  k === 'reading' ||
  k === 'book' ||
  k === 'clock' ||
  k === 'list' ||
  k === 'flame';

export function HabitCircleIcon({
  iconKey,
  className = 'h-6 w-6',
}: {
  iconKey: string;
  className?: string;
}) {
  const k = isKey(iconKey) ? iconKey : 'water';
  switch (k) {
    case 'water':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      );
    case 'reading':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    case 'book':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.042A8.967 8.967 0 006.75 4.5v15m0 0v-.25A2.25 2.25 0 019 17.25h6a2.25 2.25 0 012.25 2.25v.25m-9 0h9"
          />
        </svg>
      );
    case 'clock':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case 'list':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      );
    case 'flame':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 23a7 7 0 005-11.5 3.5 3.5 0 00-5-3 3.5 3.5 0 00-5 3A7 7 0 0012 23z" />
        </svg>
      );
    default:
      return null;
  }
}
