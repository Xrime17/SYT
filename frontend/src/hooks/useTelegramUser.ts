'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import { getOrCreateUserByTelegram, type User } from '@/api/users';
import { API_BASE } from '@/api/client';
import { CACHE_DISABLED } from '@/config';

/**
 * In Telegram Mini App: load script if needed, then get-or-create user (1 API call) and set in context.
 * Called only from TelegramUserLoader — no duplicate requests.
 */
export function useTelegramUser() {
  const {
    setUser,
    setTelegramLoading,
    setTelegramError,
    setTelegramInContext,
  } = useUser();
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unblockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const CACHE_KEY = 'syt:telegram-user-cache';
    /** Кэш пользователя считаем свежим только 5 минут — затем при открытии запрашиваем заново (очистка при старте). */
    const USER_CACHE_MAX_AGE_MS = 5 * 60 * 1000;

    const readCachedUser = (telegramId: number): User | null => {
      if (CACHE_DISABLED) return null;
      try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as {
          telegramId: number;
          user: User;
          cachedAt: number;
        };
        if (!parsed || parsed.telegramId !== telegramId || !parsed.user) return null;
        const age = Date.now() - (parsed.cachedAt ?? 0);
        if (age > USER_CACHE_MAX_AGE_MS) return null;
        return parsed.user;
      } catch {
        return null;
      }
    };

    const writeCachedUser = (telegramId: number, user: User) => {
      if (CACHE_DISABLED) return;
      try {
        window.localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            telegramId,
            user,
            cachedAt: Date.now(),
          })
        );
      } catch {
        // ignore cache write errors
      }
    };

    const mightBeTelegram = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('tgWebAppData') || params.has('tgWebAppVersion')) return true;
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
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          resolve();
        };
        const existing = document.querySelector<HTMLScriptElement>('script[src*="telegram-web-app"]');
        if (existing) {
          // Script might already be loaded before listener registration.
          if (window.Telegram?.WebApp) {
            finish();
            return;
          }
          existing.addEventListener('load', finish, { once: true });
          existing.addEventListener('error', finish, { once: true });
          setTimeout(finish, 5000);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;
        script.onload = finish;
        script.onerror = finish;
        setTimeout(finish, 5000);
        document.head.appendChild(script);
      });

    const run = () => {
      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;

      if (!tgUser) {
        setTelegramInContext(false);
        setTelegramLoading(false);
        return;
      }

      setTelegramInContext(true);
      tg?.ready();
      tg?.expand();

      // Wake up Railway (or any sleeping backend) with a cheap request so get-or-create is faster.
      try {
        fetch(`${API_BASE}/health`, { method: 'GET' }).catch(() => {});
      } catch {
        // ignore
      }

      const telegramId = tgUser.id;
      const firstName = tgUser.first_name ?? '';
      const lastName = tgUser.last_name ?? undefined;
      const username = tgUser.username ?? undefined;
      const cachedUser = readCachedUser(telegramId);
      let unblocked = false;

      const unblockUi = () => {
        if (unblocked) return;
        unblocked = true;
        setTelegramLoading(false);
      };

      setTelegramError(null);
      if (cachedUser) {
        // Fast path: instantly restore previous session while refreshing in background.
        setUser(cachedUser);
        unblockUi();
      } else {
        // First open: show "подключаем в фоне" almost immediately so app feels loaded.
        unblockTimeoutRef.current = setTimeout(unblockUi, 400);
        loadTimeoutRef.current = setTimeout(() => {
          setTelegramError('Сервер не отвечает. Проверьте интернет и обновите страницу.');
          unblockUi();
        }, 12000);
      }

      const syncUser = async () => {
        const attempts = [3500, 5000, 7000];
        let lastError: unknown;
        for (let i = 0; i < attempts.length; i += 1) {
          try {
            const freshUser = await getOrCreateUserByTelegram(
              {
                telegramId,
                firstName,
                lastName,
                username,
              },
              attempts[i]
            );
            setUser(freshUser);
            writeCachedUser(telegramId, freshUser);
            setTelegramError(null);
            return;
          } catch (e) {
            lastError = e;
            if (i < attempts.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
        }
        if (!cachedUser) {
          setTelegramError(lastError instanceof Error ? lastError.message : 'Ошибка входа');
        }
      };

      syncUser().finally(() => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
          loadTimeoutRef.current = null;
        }
        if (unblockTimeoutRef.current) {
          clearTimeout(unblockTimeoutRef.current);
          unblockTimeoutRef.current = null;
        }
        if (!cachedUser) {
          unblockUi();
        }
      });
    };

    const clearTimers = () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
      if (unblockTimeoutRef.current) {
        clearTimeout(unblockTimeoutRef.current);
        unblockTimeoutRef.current = null;
      }
    };

    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      run();
      return clearTimers;
    }
    if (!mightBeTelegram()) {
      setTelegramInContext(false);
      setTelegramLoading(false);
      return;
    }
    let cancelled = false;
    loadTelegramScript().then(() => {
      if (!cancelled) run();
    });
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [setUser, setTelegramLoading, setTelegramError, setTelegramInContext]);
}
