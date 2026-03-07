'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getUserByTelegramId } from '@/api/users';
import { createUser } from '@/api/users';

/**
 * In Telegram Mini App: load script if needed, then get/create user from API and set in context.
 */
export function useTelegramUser() {
  const {
    setUser,
    setTelegramLoading,
    setTelegramError,
    telegramLoading,
    telegramError,
  } = useUser();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mightBeTelegram = () => {
      try {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) return true;
        if (document.referrer && /t\.me|telegram\.(me|org)/i.test(document.referrer)) return true;
        return window.self !== window.top;
      } catch {
        return false;
      }
    };

    const loadTelegramScript = (): Promise<void> =>
      new Promise((resolve) => {
        if (window.Telegram?.WebApp) {
          resolve();
          return;
        }
        const existing = document.querySelector('script[src*="telegram-web-app"]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });

    const run = () => {
      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;

      if (!tgUser) {
        setTelegramLoading(false);
        return;
      }

      tg?.ready();
      tg?.expand();

      const telegramId = tgUser.id;
      const firstName = tgUser.first_name ?? '';
      const lastName = tgUser.last_name ?? undefined;
      const username = tgUser.username ?? undefined;

      setTelegramError(null);
      (async () => {
        try {
          try {
            const u = await getUserByTelegramId(String(telegramId));
            setUser(u);
          } catch {
            const u = await createUser({
              telegramId,
              firstName,
              lastName,
              username,
            });
            setUser(u);
          }
        } catch (e) {
          setTelegramError(e instanceof Error ? e.message : 'Ошибка входа');
        } finally {
          setTelegramLoading(false);
        }
      })();
    };

    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      run();
      return;
    }
    if (!mightBeTelegram()) {
      setTelegramLoading(false);
      return;
    }
    let cancelled = false;
    loadTelegramScript().then(() => {
      if (!cancelled) run();
    });
    return () => {
      cancelled = true;
    };
  }, [setUser, setTelegramLoading, setTelegramError]);

  const isInTelegram =
    typeof window !== 'undefined' &&
    !!window.Telegram?.WebApp?.initDataUnsafe?.user;

  return {
    loading: telegramLoading,
    error: telegramError,
    isInTelegram,
  };
}
