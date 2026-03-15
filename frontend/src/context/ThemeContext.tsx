'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  /** Тема из Telegram (светлая/тёмная) или из системных настроек, если не в Telegram. */
  theme: Theme;
  /** Параметры темы Telegram (bg_color, text_color и т.д.) — для кастомного дизайна. */
  themeParams: Record<string, string> | null;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Default: dark. Later can switch to light when Telegram theme is light. */
function getThemeFromTelegram(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const scheme = window.Telegram?.WebApp?.colorScheme;
  if (scheme === 'light' || scheme === 'dark') return scheme;
  return 'dark';
}

function getThemeParamsFromTelegram(): Record<string, string> | null {
  if (typeof window === 'undefined') return null;
  const params = window.Telegram?.WebApp?.themeParams;
  return params && typeof params === 'object' ? { ...params } : null;
}

/** Применяет тему к документу: data-theme и class "dark" для Tailwind. */
function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getThemeFromTelegram());
  const [themeParams, setThemeParams] = useState<Record<string, string> | null>(() =>
    getThemeParamsFromTelegram()
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncFromTelegram = () => {
      const newTheme = getThemeFromTelegram();
      setTheme(newTheme);
      setThemeParams(getThemeParamsFromTelegram());
    };

    syncFromTelegram();

    const tg = window.Telegram?.WebApp;
    if (tg?.onEvent && tg?.offEvent) {
      tg.onEvent('themeChanged', syncFromTelegram);
      return () => {
        tg.offEvent('themeChanged', syncFromTelegram);
      };
    }

    // Не в Telegram — следим за системной темой
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemTheme = () => {
      if (!window.Telegram?.WebApp?.colorScheme) {
        setTheme(media.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', handleSystemTheme);
    handleSystemTheme();
    return () => media.removeEventListener('change', handleSystemTheme);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeParams }),
    [theme, themeParams]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: 'dark',
      themeParams: null,
    };
  }
  return ctx;
}
