'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const OpenInTelegramCard = dynamic(() => import('@/components/OpenInTelegramCard').then((m) => m.OpenInTelegramCard), {
  ssr: false,
  loading: () => <div className="mb-6 h-48 animate-pulse rounded-2xl bg-slate-100" />,
});

export default function Home() {
  const { user, telegramLoading, telegramError, isInTelegram } = useUser();

  return (
    <Layout>
      <div className="mb-2 text-slate-500 text-sm">
        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
        Трекер задач
      </h1>

      {!isInTelegram && <OpenInTelegramCard />}

      {isInTelegram && telegramLoading && !user && (
        <Card className="p-8 text-center max-w-md bg-white shadow-lg">
          <div className="inline-block w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" aria-hidden />
          <p className="text-slate-700 font-medium">Загрузка…</p>
          <p className="text-slate-500 text-sm mt-1">Вход через Telegram</p>
        </Card>
      )}

      {isInTelegram && telegramError && (
        <Card className="p-6 max-w-md border-amber-200 bg-amber-50/80">
          <p className="text-amber-800 font-medium mb-1">Не удалось подключиться</p>
          <p className="text-amber-700/90 text-sm mb-4">{telegramError}</p>
          <Button variant="secondary" className="w-full rounded-2xl" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
        </Card>
      )}

      {isInTelegram && !telegramLoading && user && (
        <Card className="p-6 mb-6">
          <p className="text-slate-600 mb-4">
            Привет, <strong>{user.firstName}</strong>! Управляйте задачами, повторениями и напоминаниями.
          </p>
          <Link href="/tasks">
            <Button className="w-full rounded-2xl py-3">Перейти к задачам</Button>
          </Link>
        </Card>
      )}
    <Link href="/tracker" prefetch={false} className="block mt-4 text-center text-sm text-slate-500 hover:text-slate-700">
          Экран в стиле трекера с градиентом →
        </Link>
    </Layout>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
