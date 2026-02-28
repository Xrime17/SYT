'use client';

import { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getUserByTelegramId } from '@/api/users';
import { createUser } from '@/api/users';

/**
 * When running inside Telegram Mini App: reads initDataUnsafe.user,
 * fetches or creates backend user, and sets it in UserContext.
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

    (async () => {
      try {
        setTelegramError(null);
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
