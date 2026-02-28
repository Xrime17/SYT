'use client';

import { useTelegramUser } from '@/hooks/useTelegramUser';

/**
 * Renders nothing. When the app is opened inside Telegram Mini App,
 * fetches or creates user from initData and sets it in UserContext.
 */
export function TelegramUserLoader() {
  useTelegramUser();
  return null;
}
