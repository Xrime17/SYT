'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Корень приложения: редирект на продуктовый Home (`/home`).
 * Сам экран Home — `pages/home.tsx` (IA под Home.make).
 */
export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return null;
}
