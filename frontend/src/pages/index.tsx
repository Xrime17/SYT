'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Главная — редирект на список задач (Tasks list screen).
 * В будущем можно заменить на отдельный Home screen из Figma (connecting, logged in и т.д.).
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tasks');
  }, [router]);

  return null;
}
