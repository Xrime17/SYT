'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

/** In Telegram Mini App, apply Telegram theme to body so content is visible (no random black). */
function useTelegramTheme() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bg = window.Telegram?.WebApp?.themeParams?.bg_color;
    if (!bg) return;
    const prev = document.body.style.background;
    document.body.style.background = bg;
    return () => {
      document.body.style.background = prev;
    };
  }, []);
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        active
          ? 'bg-[var(--syt-accent)] text-white'
          : 'text-[var(--syt-text-muted)] hover:text-[var(--syt-text)]'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  useTelegramTheme();
  const { user, logout, isInTelegram } = useUser();
  const { pathname } = useRouter();
  const isTelegram = isInTelegram || (typeof window !== 'undefined' && !!window.Telegram?.WebApp);

  const today = new Date();
  const dateStr = today.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--syt-background)]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--syt-surface)] border-b border-[var(--syt-border)]">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="font-bold text-lg text-[var(--syt-text)] truncate shrink-0"
            >
              Syt
            </Link>
            <span className="text-xs text-[var(--syt-text-muted)] hidden sm:inline truncate">
              {dateStr}
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/tracker" active={pathname === '/tracker'}>
              Tracker
            </NavLink>
            <NavLink href="/tasks" active={pathname === '/tasks'}>
              Tasks
            </NavLink>
            <NavLink href="/recurring" active={pathname === '/recurring'}>
              Recurring
            </NavLink>
            <NavLink href="/reminders" active={pathname === '/reminders'}>
              Reminders
            </NavLink>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--syt-accent)] flex items-center justify-center text-white font-semibold text-sm">
                  {user.firstName?.charAt(0) || '?'}
                </div>
                <span className="text-sm text-[var(--syt-text-muted)] hidden md:inline max-w-[100px] truncate">
                  {user.firstName}
                </span>
              </div>
            )}
            {isTelegram ? (
              <button
                type="button"
                onClick={() => window.Telegram?.WebApp?.close()}
                className="rounded-full p-2 text-[var(--syt-text-muted)] hover:text-[var(--syt-text)]"
                title="Закрыть"
                aria-label="Закрыть"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              user && (
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm text-[var(--syt-text-muted)] hover:text-[var(--syt-text)]"
                >
                  Выход
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main — centered, max 640px, 16px side padding, scrollable, no shadows */}
      <main className="flex-1 overflow-y-auto mx-auto w-full max-w-[640px] px-4 py-6 pb-24 sm:pb-8">
        <div className="animate-in">
          {children}
        </div>
      </main>

      {/* Bottom nav (mobile) — 52px height, #161b22 + border #2a2f37; labels 11px; active #6366f1, inactive #9ca3af */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 sm:hidden h-[52px] bg-[var(--syt-surface)] border-t border-[var(--syt-border)] safe-area-pb">
        <div className="flex justify-around items-center h-full max-w-[640px] mx-auto">
          <Link
            href="/tracker"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 ${
              pathname === '/tracker'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/tracker' ? 'page' : undefined}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tracker
          </Link>
          <Link
            href="/tasks"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 ${
              pathname === '/tasks'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/tasks' ? 'page' : undefined}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Tasks
          </Link>
          <Link
            href="/recurring"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 ${
              pathname === '/recurring'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/recurring' ? 'page' : undefined}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recurring
          </Link>
          <Link
            href="/reminders"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 ${
              pathname === '/reminders'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/reminders' ? 'page' : undefined}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Reminders
          </Link>
        </div>
      </nav>
    </div>
  );
}
