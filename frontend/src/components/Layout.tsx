'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

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
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;

  const today = new Date();
  const dateStr = today.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="font-bold text-lg text-slate-900 truncate shrink-0"
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
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
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
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
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
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 sm:hidden bg-white border-t border-slate-200 safe-area-pb">
        <div className="flex justify-around items-center h-14 max-w-2xl mx-auto">
          <Link
            href="/tasks"
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs ${
              pathname === '/tasks' ? 'text-indigo-600' : 'text-slate-500'
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
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs ${
              pathname === '/recurring' ? 'text-indigo-600' : 'text-slate-500'
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
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs ${
              pathname === '/reminders' ? 'text-indigo-600' : 'text-slate-500'
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
