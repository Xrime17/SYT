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
        <Card className="mb-6 p-6">
          <p className="text-slate-600 mb-4">
            Откройте приложение в Telegram: нажмите <strong>Start</strong> в боте, затем кнопку <strong>Open</strong>.
          </p>
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
