'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function TrackerPage() {
  const router = useRouter();
  const dateStr = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950/95 to-slate-900 text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Назад"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs">✓</span>
          <h1 className="font-semibold text-lg">Просто Трекер</h1>
        </div>
        <button
          type="button"
          className="p-2 -mr-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Добавить"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </header>

      {/* Date row */}
      <div className="flex items-center gap-3 px-4 pb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/80 to-violet-600/80 flex items-center justify-center text-sm font-medium shrink-0">
          ?
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5">
          <button type="button" className="p-1 text-white/70 hover:text-white" aria-label="Пред. день">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="flex-1 text-center text-sm font-medium truncate">Сегодня {dateStr}</span>
          <button type="button" className="p-1 text-white/70 hover:text-white" aria-label="След. день">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <span className="text-sm text-white/80 shrink-0">0/0</span>
        <button type="button" className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10" aria-label="Календарь">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 pb-6">
        <div
          className="rounded-2xl border border-white/10 overflow-hidden mb-4"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
            boxShadow: '0 4px 24px -4px rgba(0,0,0,0.3)',
          }}
        >
          <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-5xl mb-4">🦆</span>
            <p className="text-white/60 text-center">На сегодня задач нет</p>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium text-sm mb-3 border border-white/10 transition-all hover:bg-white/10 active:scale-[0.99]"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 100%)',
            boxShadow: '0 2px 12px -2px rgba(0,0,0,0.2)',
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить задачу
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-medium text-sm text-white/80 border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-[0.99]"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Ещё
        </button>
      </main>

      {/* Bottom nav */}
      <nav className="flex items-center justify-around h-16 px-2 border-t border-white/10 bg-black/20 backdrop-blur-sm safe-area-pb">
        <Link
          href="/tracker"
          className="flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium text-indigo-300 rounded-lg mx-1 outline outline-2 outline-indigo-500/50 outline-offset-2 -outline-offset-2"
          aria-current="page"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Задачи
        </Link>
        <Link
          href="/recurring"
          className="flex flex-col items-center justify-center flex-1 py-2 text-xs text-white/60 hover:text-white/90 rounded-lg mx-1 transition-colors"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Привычки
        </Link>
        <Link
          href="/tasks"
          className="flex flex-col items-center justify-center flex-1 py-2 text-xs text-white/60 hover:text-white/90 rounded-lg mx-1 transition-colors"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Цели на год
        </Link>
        <Link
          href="/reminders"
          className="flex flex-col items-center justify-center flex-1 py-2 text-xs text-white/60 hover:text-white/90 rounded-lg mx-1 transition-colors"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Аналитика
        </Link>
      </nav>
    </div>
  );
}
