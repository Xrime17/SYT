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
  themeParams?: Record<string, string>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export {};
