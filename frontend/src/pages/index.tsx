'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const BOT_LINK = process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK ?? 'https://t.me/save_you_time_bot';

export default function Home() {
  const { user, telegramLoading, telegramError, isInTelegram } = useUser();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const looksLikeTelegram = () => {
      const params = new URLSearchParams(window.location.search);
      return (
        isInTelegram ||
        params.has('tgWebAppData') ||
        params.has('tgWebAppVersion') ||
        !!window.Telegram?.WebApp?.initDataUnsafe?.user ||
        !!window.Telegram?.WebApp ||
        (document.referrer ? /t\.me|telegram\.(me|org)/i.test(document.referrer) : false) ||
        window.self !== window.top
      );
    };

    // В iframe (Mini App) никогда не редиректим — иначе при открытии по кнопке «ОТКРЫТЬ» уходим в чат с ботом.
    if (window.self !== window.top) return;

    if (looksLikeTelegram()) return;

    // Даём время загрузиться скрипту Telegram и выставить isInTelegram, затем редирект только если точно не в ТГ.
    const t = setTimeout(() => {
      if (looksLikeTelegram()) return;
      window.location.replace(BOT_LINK);
    }, 2500);

    return () => clearTimeout(t);
  }, [isInTelegram]);

  return (
    <Layout>
      <div className="mb-2 text-slate-500 text-sm">
        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-6">
        Трекер задач
      </h1>

      {!isInTelegram && (
        <Card className="p-6 max-w-md text-center">
          <p className="text-slate-600 text-sm">Перенаправляем в Telegram…</p>
          <a href={BOT_LINK} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
            <Button className="rounded-2xl px-6">Открыть бота</Button>
          </a>
        </Card>
      )}

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

      {isInTelegram && !telegramLoading && !telegramError && !user && (
        <Card className="p-6 max-w-md">
          <p className="text-slate-700 font-medium mb-2">Подключаем аккаунт в фоне…</p>
          <p className="text-slate-500 text-sm mb-4">
            Приложение уже открыто. Можно продолжить, пока сервер просыпается.
          </p>
          <Link href="/tracker">
            <Button className="w-full rounded-2xl py-3">Открыть трекер сейчас</Button>
          </Link>
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
