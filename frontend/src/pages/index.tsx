'use client';

import { useUser } from '@/context/UserContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { Layout } from '@/components/Layout';

export default function Home() {
  const { user } = useUser();
  const { loading, error, isInTelegram } = useTelegramUser();

  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Трекер задач Syt
      </h1>

      {!isInTelegram && (
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Откройте приложение в Telegram: нажмите <strong>Start</strong> в боте, затем кнопку <strong>Open</strong>.
        </p>
      )}

      {isInTelegram && loading && !user && (
        <p className="text-zinc-500 dark:text-zinc-400">Загрузка…</p>
      )}

      {isInTelegram && error && (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      )}

      {isInTelegram && !loading && user && (
        <p className="text-zinc-600 dark:text-zinc-400">
          Привет, {user.firstName}! Перейдите в Задачи, Повторения или Напоминания.
        </p>
      )}
    </Layout>
  );
}
