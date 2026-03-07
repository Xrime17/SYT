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
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-400 text-white shadow-md shadow-indigo-500/25'
          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm shadow-slate-200/30">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent truncate shrink-0"
            >
              Syt
            </Link>
            <span className="text-xs text-slate-500 hidden sm:inline truncate">
              {dateStr}
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink href="/tasks" active={pathname === '/tasks'}>
              Задачи
            </NavLink>
            <NavLink href="/recurring" active={pathname === '/recurring'}>
              Повторения
            </NavLink>
            <NavLink href="/reminders" active={pathname === '/reminders'}>
              Напоминания
            </NavLink>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-indigo-500/25">
                  {user.firstName?.charAt(0) || '?'}
                </div>
                <span className="text-sm text-slate-600 hidden md:inline max-w-[100px] truncate">
                  {user.firstName}
                </span>
              </div>
            )}
            {isTelegram ? (
              <button
                type="button"
                onClick={() => window.Telegram?.WebApp?.close()}
                className="rounded-full p-2 text-slate-500 hover:bg-white/80 hover:text-slate-700 transition-all duration-200"
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
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Выход
                </button>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-6 pb-24 sm:pb-8">
        <div className="animate-in">
          {children}
        </div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 sm:hidden bg-white/70 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.06)] safe-area-pb">
        <div className="flex justify-around items-center h-14 max-w-2xl mx-auto">
          <Link
            href="/tasks"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs transition-all duration-200 rounded-lg mx-1 ${
              pathname === '/tasks' ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-current={pathname === '/tasks' ? 'page' : undefined}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Задачи
          </Link>
          <Link
            href="/recurring"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs transition-all duration-200 rounded-lg mx-1 ${
              pathname === '/recurring' ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-current={pathname === '/recurring' ? 'page' : undefined}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Повторения
          </Link>
          <Link
            href="/reminders"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs transition-all duration-200 rounded-lg mx-1 ${
              pathname === '/reminders' ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-slate-700'
            }`}
            aria-current={pathname === '/reminders' ? 'page' : undefined}
          >
            <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Напоминания
          </Link>
        </div>
      </nav>
    </div>
  );
}
