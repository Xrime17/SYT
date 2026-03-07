'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useUser } from '@/context/UserContext';
import { createTask } from '@/api/tasks';

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !title.trim()) return;
      setError(null);
      setLoading(true);
      try {
        await createTask({ userId: user.id, title: title.trim(), description: description.trim() || undefined });
        router.push('/tasks');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    },
    [user, title, router]
  );

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/tasks"
          className="p-2 rounded-xl text-slate-500 hover:bg-white/80 hover:text-slate-700 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
          Новая задача
        </h1>
      </div>

      {!user ? (
        <p className="text-slate-500">Откройте в Telegram.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Название"
            placeholder="Что сделать?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Описание (необязательно)"
            placeholder="Подробности"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded-2xl py-3">
            {loading ? 'Создаём…' : 'Добавить задачу'}
          </Button>
        </form>
      )}
    </Layout>
  );
}
