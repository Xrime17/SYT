'use client';

import { useCallback, useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PriorityBadge, type Priority } from '@/components/PriorityBadge';
import { useUser } from '@/context/UserContext';
import { getTasks, updateTask, deleteTask, type Task } from '@/api/tasks';

const OpenInTelegramCard = dynamic(
  () => import('@/components/OpenInTelegramCard').then((m) => m.OpenInTelegramCard),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-[var(--syt-card)]" /> }
);

function formatDate(dueDate: string | null | undefined): string {
  if (!dueDate) return '';
  const d = new Date(dueDate);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDue(dueDate: string | null | undefined): string {
  if (!dueDate) return '';
  const d = new Date(dueDate);
  return `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export default function TasksPage() {
  const { user, isInTelegram, telegramLoading, telegramError } = useUser();
  const [mutateError, setMutateError] = useState<string | null>(null);

  const { data: tasks = [], error: fetchError, isLoading, mutate } = useSWR(
    user?.id ? ['tasks', user.id] : null,
    ([, userId]) => getTasks(userId),
    {
      revalidateOnFocus: true,
      focusThrottleInterval: 60 * 1000,
      dedupingInterval: 2000,
      revalidateIfStale: true,
    }
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
  const showLoading = user && isLoading && tasks.length === 0;
  const showList = user && tasks.length > 0;
  const showEmptyState = user && !isLoading && tasks.length === 0 && !error;
  const showErrorState = user && !isLoading && !!error;
  const prioritySafe = (p: string): Priority =>
    p === 'LOW' || p === 'MEDIUM' || p === 'HIGH' ? p : 'MEDIUM';

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header — Tasks + X / Y completed (Figma) */}
        <header className="flex items-center justify-between h-12">
          <h1 className="text-xl font-semibold text-[var(--syt-text)]">
            Tasks
          </h1>
          {user && tasks.length > 0 && (
            <span className="text-sm text-[var(--syt-text-secondary)]">
              {completed} / {tasks.length} completed
            </span>
          )}
        </header>

        {!isInTelegram && !user && (
          <div className="mx-auto max-w-md">
            <OpenInTelegramCard />
          </div>
        )}

        {isInTelegram && telegramLoading && !user && (
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-8 flex flex-col items-center justify-center min-h-[150px] gap-4">
            <p className="text-sm text-[var(--syt-text-secondary)]">Connecting…</p>
          </div>
        )}

        {isInTelegram && telegramError && !user && (
          <Card className="p-6 max-w-md mx-auto border-[var(--syt-error)]">
            <p className="font-medium text-[var(--syt-text)] mb-1">Не удалось подключиться</p>
            <p className="text-sm text-[var(--syt-text-secondary)] mb-4">{telegramError}</p>
            <Button variant="secondary" className="rounded-xl" onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </Card>
        )}

        {/* State: Loading */}
        {showLoading && (
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-8 flex items-center justify-center min-h-[120px]">
            <p className="text-sm text-[var(--syt-text-secondary)]">Loading tasks…</p>
          </div>
        )}

        {/* State: Error (Figma) */}
        {showErrorState && (
          <div className="rounded-[14px] border border-[var(--syt-error)] bg-[var(--syt-card)] p-5 flex flex-col gap-3">
            <p className="font-semibold text-base text-[var(--syt-text)]">Something went wrong</p>
            <p className="text-sm text-[var(--syt-text-secondary)]">Please try again.</p>
            <Button
              variant="secondary"
              className="rounded-xl w-fit"
              onClick={() => mutate()}
            >
              Refresh page
            </Button>
          </div>
        )}

        {/* State: Empty (Figma) */}
        {showEmptyState && (
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-8 flex flex-col items-center justify-center min-h-[150px] gap-6">
            <p className="font-semibold text-base text-[var(--syt-text)]">No tasks yet</p>
            <Link href="/tasks/new">
              <Button variant="primary" className="rounded-xl">
                + Add task
              </Button>
            </Link>
          </div>
        )}

        {/* State: Task list (Figma) — [Title block] [Date] [Checkbox] [Delete] */}
        {showList && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <Link href="/tasks/new">
                <Button variant="primary" className="rounded-xl text-sm">
                  + Add task
                </Button>
              </Link>
            </div>
            {tasks.map((task) => {
              const isCompleted = task.status === 'COMPLETED';
              return (
                <div
                  key={task.id}
                  className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex items-center gap-3 min-h-[80px]"
                >
                  <div className="min-w-0 flex-1 flex flex-col gap-2">
                    <p
                      className={`font-medium text-sm truncate ${
                        isCompleted
                          ? 'text-[var(--syt-text)] opacity-60 line-through'
                          : 'text-[var(--syt-text)]'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div>
                      <PriorityBadge
                        priority={prioritySafe(task.priority)}
                        className="text-[10px] px-2 py-0.5 rounded"
                      />
                    </div>
                  </div>
                  {task.dueDate && (
                    <span
                      className={`text-xs shrink-0 ${
                        isCompleted
                          ? 'text-[var(--syt-text-secondary)] opacity-60'
                          : 'text-[var(--syt-text-secondary)]'
                      }`}
                    >
                      {isCompleted ? formatDate(task.dueDate) : formatDue(task.dueDate)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggle(task)}
                    className={`shrink-0 w-6 h-5 rounded flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-[var(--syt-accent-glow)] text-white'
                        : 'border-2 border-[var(--syt-border)] bg-[var(--syt-card)] hover:border-[var(--syt-accent)]'
                    }`}
                    aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isCompleted && <span className="text-xs font-semibold">✔</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(task)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center text-[var(--syt-text-muted)] hover:text-[var(--syt-error)] rounded"
                    aria-label="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
