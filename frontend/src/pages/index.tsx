'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function Home() {
  const { user } = useUser();
  const { loading, error, isInTelegram } = useTelegramUser();

  return (
    <Layout>
      <div className="mb-2 text-slate-500 text-sm">
        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Трекер задач</h1>

      {!isInTelegram && (
        <Card className="mb-6 p-8 text-center max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
            ✨
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Откройте в Telegram</h2>
          <p className="text-slate-600 text-sm mb-6">
            Нажмите <strong>Start</strong> в боте, затем кнопку <strong>Open</strong>, чтобы войти.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK ?? 'https://t.me/save_you_time_bot'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="rounded-2xl px-6">Открыть бота</Button>
          </a>
        </Card>
      )}

      {isInTelegram && loading && !user && (
        <p className="text-slate-500 py-8">Загрузка…</p>
      )}

      {isInTelegram && error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {isInTelegram && !loading && user && (
        <Card className="p-6 mb-6">
          <p className="text-slate-600 mb-4">
            Привет, <strong>{user.firstName}</strong>! Управляйте задачами, повторениями и напоминаниями.
          </p>
          <Link href="/tasks">
            <Button className="w-full rounded-2xl py-3">Перейти к задачам</Button>
          </Link>
        </Card>
      )}
    </Layout>
  );
}
