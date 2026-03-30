'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

/**
 * Продуктовый chrome Telegram Mini App (Syt): шапка + нижний таббар на мобиле.
 *
 * Порядок табов: Home → Tracker → Tasks → Recurring → Reminders (`/home`, `/tracker`, …).
 * Это не навигация демо UI Kit в `ai-system/` (там отдельные вкладки вроде Tokens / Basic / Screens).
 */

/** In Telegram Mini App, apply Telegram theme to body so content is visible (no random black). */
function useTelegramTheme() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tg = window.Telegram?.WebApp;
    const bg = tg?.themeParams?.bg_color;
    if (!bg) return;

    const prev = document.body.style.background;
    document.body.style.background = bg;

    const isDark = tg?.colorScheme === 'dark';
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');
    if (isDark) root.classList.add('dark');

    return () => {
      document.body.style.background = prev;
      if (!hadDark) root.classList.remove('dark');
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

  /** Единая сетка: max ширина + отступы с учётом вырезов (env safe-area) */
  const frame =
    'mx-auto w-full min-w-0 max-w-[min(100%,var(--syt-content-max))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]';

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-[var(--syt-background)] pt-[env(safe-area-inset-top,0px)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--syt-border)] bg-[var(--syt-surface)]">
        <div className={`flex h-14 items-center justify-between gap-3 ${frame}`}>
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/home"
              className="font-bold text-lg text-[var(--syt-text)] truncate shrink-0"
            >
              Syt
            </Link>
            <span className="text-xs text-[var(--syt-text-muted)] hidden sm:inline truncate">
              {dateStr}
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/home" active={pathname === '/home'}>
              Home
            </NavLink>
            <NavLink href="/tracker" active={pathname === '/tracker'}>
              Tracker
            </NavLink>
            <NavLink
              href="/tasks"
              active={pathname === '/tasks' || pathname.startsWith('/tasks/')}
            >
              Tasks
            </NavLink>
            <NavLink
              href="/recurring"
              active={pathname === '/recurring' || pathname.startsWith('/recurring/')}
            >
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

      {/* Main — та же ширина колонки, что и шапка / таббар */}
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className={`flex-1 py-6 pb-24 sm:pb-8 ${frame}`}>
          <div className="animate-in">{children}</div>
        </div>
      </main>

      {/* Bottom nav (mobile) — 52px height; safe-area снизу отдельным padding у контейнера */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--syt-border)] bg-[var(--syt-surface)] pb-[env(safe-area-inset-bottom,0px)] sm:hidden">
        <div className={`flex h-[52px] items-center justify-around ${frame}`}>
          <Link
            href="/home"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 min-w-0 ${
              pathname === '/home'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/home' ? 'page' : undefined}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <span className="truncate max-w-full px-0.5">Home</span>
          </Link>
          <Link
            href="/tracker"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 min-w-0 ${
              pathname === '/tracker'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/tracker' ? 'page' : undefined}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="truncate max-w-full px-0.5">Tracker</span>
          </Link>
          <Link
            href="/tasks"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 min-w-0 ${
              pathname === '/tasks' || pathname.startsWith('/tasks/')
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname.startsWith('/tasks') ? 'page' : undefined}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="truncate max-w-full px-0.5">Tasks</span>
          </Link>
          <Link
            href="/recurring"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 min-w-0 ${
              pathname === '/recurring' || pathname.startsWith('/recurring/')
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname.startsWith('/recurring') ? 'page' : undefined}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="truncate max-w-full px-0.5">Recurring</span>
          </Link>
          <Link
            href="/reminders"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-[11px] gap-0.5 min-w-0 ${
              pathname === '/reminders'
                ? 'text-[var(--syt-accent)] font-semibold'
                : 'text-[var(--syt-text-secondary)]'
            }`}
            aria-current={pathname === '/reminders' ? 'page' : undefined}
          >
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="truncate max-w-full px-0.5">Reminders</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
