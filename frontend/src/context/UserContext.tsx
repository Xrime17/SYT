'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { User } from '@/api/users';

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  telegramLoading: boolean;
  telegramError: string | null;
  isInTelegram: boolean;
  setTelegramLoading: (v: boolean) => void;
  setTelegramError: (v: string | null) => void;
  setTelegramInContext: (v: boolean) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [telegramLoading, setTelegramLoading] = useState(true);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [isInTelegram, setTelegramInContext] = useState(false);
  const logout = useCallback(() => setUserState(null), []);
  const setUser = useCallback((u: User | null) => setUserState(u), []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
        telegramLoading,
        telegramError,
        isInTelegram,
        setTelegramLoading,
        setTelegramError,
        setTelegramInContext,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}
