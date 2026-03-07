'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TaskItem } from '@/components/TaskItem';
import { useUser } from '@/context/UserContext';
import { getTasks, updateTask, deleteTask, type Task } from '@/api/tasks';

const OpenInTelegramCard = dynamic(
  () => import('@/components/OpenInTelegramCard').then((m) => m.OpenInTelegramCard),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-slate-100" /> }
);

export default function TasksPage() {
  const { user, isInTelegram, telegramLoading, telegramError } = useUser();
  const [mutateError, setMutateError] = useState<string | null>(null);

  const { data: tasks = [], error: fetchError, isLoading, mutate } = useSWR(
    user?.id ? ['tasks', user.id] : null,
    ([, userId]) => getTasks(userId),
    { revalidateOnFocus: false }
  );

  const handleToggle = useCallback(
    async (task: Task) => {
      if (!user) return;
      const newStatus = task.status === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
      try {
        const updated = await updateTask(task.id, { status: newStatus });
        mutate(
          (prev) => (prev ?? []).map((t) => (t.id === task.id ? updated : t)),
          { revalidate: false }
        );
      } catch (e) {
        setMutateError(e instanceof Error ? e.message : 'Ошибка');
      }
    },
    [user, mutate]
  );

  const handleDelete = useCallback(
    async (task: Task) => {
      if (!confirm('Удалить задачу?')) return;
      try {
        await deleteTask(task.id);
        mutate((prev) => (prev ?? []).filter((t) => t.id !== task.id), { revalidate: false });
      } catch (e) {
        setMutateError(e instanceof Error ? e.message : 'Ошибка');
      }
    },
    [mutate]
  );

  const error =
    mutateError ||
    (fetchError
      ? fetchError instanceof Error && fetchError.message === 'Failed to fetch'
        ? 'Не удалось загрузить задачи. Проверьте подключение.'
        : fetchError instanceof Error
          ? fetchError.message
          : 'Не удалось загрузить задачи'
      : null);

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const showList = user && !isLoading && tasks.length > 0;
  const showEmptyState = user && !isLoading && tasks.length === 0 && !error;
  const showErrorState = user && error;
  const showAddButton = user && !isLoading;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
          Задачи
        </h1>
        {user && tasks.length > 0 && (
          <span className="text-sm text-slate-500">
            {completed}/{tasks.length}
          </span>
        )}
      </div>

      {!isInTelegram && !user && (
        <div className="mx-auto max-w-md">
          <OpenInTelegramCard />
        </div>
      )}

      {isInTelegram && telegramLoading && !user && (
        <div className="flex flex-col items-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Вход…</p>
        </div>
      )}

      {isInTelegram && telegramError && !user && (
        <Card className="p-6 max-w-md mx-auto border-amber-200 bg-amber-50/80">
          <p className="text-amber-800 font-medium mb-1">Не удалось подключиться</p>
          <p className="text-amber-700/90 text-sm mb-4">{telegramError}</p>
          <p className="text-amber-700/80 text-xs mb-4">Проверьте интернет и обновите страницу.</p>
          <Button variant="secondary" className="w-full rounded-2xl" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
        </Card>
      )}

      {user && isLoading && (
        <div className="flex flex-col items-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Загрузка задач…</p>
        </div>
      )}

      {showErrorState && (
        <Card className="p-4 mb-4 border-amber-200 bg-amber-50/80">
          <p className="text-amber-800 text-sm">{error}</p>
          <p className="text-amber-700/80 text-xs mt-1">Проверьте подключение и обновите страницу.</p>
        </Card>
      )}

      {showEmptyState && (
        <Card className="p-8 text-center mb-4">
          <p className="text-slate-600 mb-6">У вас пока нет задач. Добавьте первую.</p>
          <Link href="/tasks/new">
            <Button className="rounded-2xl px-6">+ Добавить задачу</Button>
          </Link>
        </Card>
      )}

      {showList && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggleDone={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showAddButton && (showList || showErrorState) && (
        <div className="mt-6">
          <Link href="/tasks/new" className="block">
            <Button variant="secondary" className="w-full rounded-2xl py-3">
              + Добавить задачу
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  );
}
