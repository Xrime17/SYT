'use client';

import Link from 'next/link';
import { Layout } from '@/components/Layout';

export default function TrackerPage() {
  const dateStr = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <Layout>
      <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
        Трекер на день
      </h1>

      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white overflow-hidden mb-4 shadow-sm">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/80 to-violet-600/80 flex items-center justify-center text-sm font-medium shrink-0 text-white">
            ?
          </div>
          <div className="flex-1 min-w-0 rounded-full bg-slate-100 border border-slate-200 px-4 py-2.5 flex items-center gap-2">
            <button type="button" className="p-1 text-slate-400 hover:text-slate-600" aria-label="Пред. день">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="flex-1 text-center text-sm font-medium truncate text-slate-700">Сегодня {dateStr}</span>
            <button type="button" className="p-1 text-slate-400 hover:text-slate-600" aria-label="След. день">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="text-sm text-slate-500 shrink-0">0/0</span>
        </div>
        <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
          <span className="text-5xl mb-4">🦆</span>
          <p className="text-slate-500 text-center">На сегодня задач нет</p>
        </div>
      </div>

      <Link
        href="/tasks/new"
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-medium text-sm mb-3 border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Добавить задачу
      </Link>

      <Link
        href="/tasks"
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-medium text-sm text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        Все задачи
      </Link>
    </Layout>
  );
}
