'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Button } from './Button';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <nav className="flex items-center gap-4">
            <Link href="/" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
              Syt
            </Link>
            <Link href="/tasks" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Задачи
            </Link>
            <Link href="/recurring" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Повторения
            </Link>
            <Link href="/reminders" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Напоминания
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {user.firstName}
                  {user.lastName ? ` ${user.lastName}` : ''}
                </span>
                {isTelegram ? (
                  <Button
                    variant="secondary"
                    onClick={() => window.Telegram?.WebApp?.close()}
                  >
                    Закрыть
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={logout}>
                    Выход
                  </Button>
                )}
              </>
            ) : (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Не авторизован</span>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}
