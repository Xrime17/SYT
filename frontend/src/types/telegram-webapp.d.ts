export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
  auth_date?: number;
  hash?: string;
  start_param?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  version: string;
  close: () => void;
  ready: () => void;
  expand: () => void;
  isExpanded: boolean;
  /** Тема интерфейса: "light" | "dark". Есть также в CSS как var(--tg-color-scheme). */
  colorScheme?: 'light' | 'dark';
  themeParams?: Record<string, string>;
  /** Подписка на смену темы (день/ночь и т.д.). */
  onEvent?: (eventType: string, callback: () => void) => void;
  offEvent?: (eventType: string, callback: () => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export {};
