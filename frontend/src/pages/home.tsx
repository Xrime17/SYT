'use client';

/**
 * Home — хедер Tasks, полоса категорий, блок привычек (заглушка), 4 аккордеона:
 * Today / Tomorrow / This week / Completed this week.
 * `groupHomeLists` на клиенте по отфильтрованному списку `GET /tasks/:userId`.
 * Напоминания: `GET /reminders/user`, выключение `POST /reminders/quick`, новое время — `POST /reminders` (upsert).
 */

import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { BottomSheet } from '@/components/BottomSheet';
import { HomeCategoryEditSheet } from '@/components/HomeCategoryEditSheet';
import { HomeCategoryFilterChip } from '@/components/HomeCategoryFilterChip';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HomeEmptyState } from '@/components/HomeEmptyState';
import { HomeTaskCard } from '@/components/HomeTaskCard';
import { HomeReminderSheet } from '@/components/HomeReminderSheet';
import type { Priority } from '@/components/PriorityBadge';
import {
  SytAccordion,
  SytAccordionContent,
  SytAccordionItem,
  SytAccordionTrigger,
} from '@/components/SytAccordion';
import { useUser } from '@/context/UserContext';
import {
  fetchTasksListForSwrKey,
  tasksListSwrKey,
  updateTask,
  deleteTask,
  type Task,
} from '@/api/tasks';
import { getHomeCategories, type HomeCategory } from '@/api/home-categories';
import { getHomeSubtitleMetrics } from '@/api/home-metrics';
import {
  getRemindersForUser,
  toggleHomeQuickReminder,
  createReminder,
  type Reminder,
} from '@/api/reminders';
import { groupHomeLists, type HomeListKey } from '@/utils/home-task-groups';

const OpenInTelegramCard = dynamic(
  () => import('@/components/OpenInTelegramCard').then((m) => m.OpenInTelegramCard),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-[var(--syt-card)]" /> }
);

type AccordionKey = HomeListKey;

const ACCORDION_SECTIONS: { key: AccordionKey; title: string }[] = [
  { key: 'today', title: 'Today' },
  { key: 'tomorrow', title: 'Tomorrow' },
  { key: 'thisWeek', title: 'This week' },
  { key: 'completedThisWeek', title: 'Completed this week' },
];

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

function statusLabel(status: string): string {
  if (status === 'COMPLETED') return 'Done';
  if (status === 'ARCHIVED') return 'Archived';
  return 'Active';
}

function formatTimeLocal(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function HomePage() {
  const { user, isInTelegram, telegramLoading, telegramError } = useUser();
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [categorySheet, setCategorySheet] = useState<
    null | { mode: 'create' } | { mode: 'edit'; category: HomeCategory }
  >(null);
  /** `null` — фильтр «все задачи»; иначе UUID `HomeCategory`. */
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [reminderSheetTask, setReminderSheetTask] = useState<Task | null>(null);

  const tasksSwrKey = user?.id ? tasksListSwrKey(user.id, selectedCategoryFilter) : null;

  const { data: tasks = [], error: fetchError, isLoading, mutate } = useSWR(
    tasksSwrKey,
    fetchTasksListForSwrKey,
    {
      revalidateOnFocus: true,
      focusThrottleInterval: 60 * 1000,
      dedupingInterval: 2000,
      revalidateIfStale: true,
    }
  );

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
    mutate: mutateCategories,
  } = useSWR(
    user?.id ? (['home-categories', user.id] as const) : null,
    ([, userId]) => getHomeCategories(userId),
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      focusThrottleInterval: 60 * 1000,
      dedupingInterval: 5000,
    }
  );

  const { data: homeMetrics, mutate: mutateHomeMetrics } = useSWR(
    user?.id ? ['homeMetrics', user.id] : null,
    ([, uid]) => getHomeSubtitleMetrics(uid),
    { revalidateOnFocus: true, dedupingInterval: 5000 }
  );

  const categoriesList = categoriesData ?? [];
  const showCategoriesLoadingEmpty = categoriesIsLoading && categoriesData === undefined;
  const showCategoriesErrorEmpty =
    Boolean(categoriesError) && !categoriesIsLoading && categoriesData === undefined;

  const {
    data: remindersData,
    isLoading: remindersIsLoading,
    mutate: mutateReminders,
  } = useSWR(
    user?.id ? (['reminders', user.id] as const) : null,
    ([, uid]) => getRemindersForUser(uid),
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 5000,
    }
  );

  /** Пока нет первого ответа по напоминаниям — не даём toggle (избегаем ложного «выкл»). */
  const remindersHydrating = remindersData === undefined && remindersIsLoading;

  const taskIdsWithUnsentReminder = useMemo(() => {
    const s = new Set<string>();
    if (!remindersData) return s;
    for (const r of remindersData) {
      if (!r.sent) s.add(r.taskId);
    }
    return s;
  }, [remindersData]);

  const buckets = useMemo(() => groupHomeLists(tasks), [tasks]);

  const clearMutateError = useCallback(() => setMutateError(null), []);

  const reminderByTaskId = useMemo(() => {
    const m = new Map<string, Reminder>();
    for (const r of remindersData ?? []) {
      if (!r.sent) m.set(r.taskId, r);
    }
    return m;
  }, [remindersData]);

  const timeForTask = useCallback(
    (task: Task): string | null => {
      const r = reminderByTaskId.get(task.id);
      if (r) return formatTimeLocal(r.remindAt);
      if (task.dueDate) return formatTimeLocal(task.dueDate);
      return null;
    },
    [reminderByTaskId]
  );

  const handleToggle = useCallback(
    async (task: Task) => {
      if (!user) return;
      clearMutateError();
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
    [user, mutate, clearMutateError]
  );

  const handleDelete = useCallback(
    async (task: Task) => {
      clearMutateError();
      try {
        await deleteTask(task.id);
        mutate((prev) => (prev ?? []).filter((t) => t.id !== task.id), { revalidate: false });
        void mutateReminders();
      } catch (e) {
        setMutateError(e instanceof Error ? e.message : 'Ошибка');
      }
    },
    [mutate, mutateReminders, clearMutateError]
  );

  const handleSaveReminder = useCallback(
    async (remindAtIso: string) => {
      if (!user || !reminderSheetTask) return;
      clearMutateError();
      try {
        const reminder = await createReminder({
          taskId: reminderSheetTask.id,
          remindAt: remindAtIso,
        });
        await mutateReminders(
          (current) => {
            const list = current ?? [];
            const rest = list.filter((r) => r.taskId !== reminderSheetTask.id);
            return [...rest, reminder];
          },
          { revalidate: false }
        );
      } catch (e) {
        setMutateError(e instanceof Error ? e.message : 'Ошибка');
      }
    },
    [user, reminderSheetTask, mutateReminders, clearMutateError]
  );

  const handleReminderPress = useCallback(
    async (task: Task) => {
      if (!user || remindersHydrating) return;
      clearMutateError();
      if (taskIdsWithUnsentReminder.has(task.id)) {
        let rollback: Reminder[] = [];
        await mutateReminders(
          (current) => {
            const list = current ?? [];
            rollback = list.map((r) => ({
              id: r.id,
              taskId: r.taskId,
              remindAt: r.remindAt,
              sent: r.sent,
            }));
            return list.filter((r) => r.taskId !== task.id);
          },
          { revalidate: false }
        );
        try {
          await toggleHomeQuickReminder(task.id, user.id, false);
        } catch (e) {
          await mutateReminders(() => rollback, { revalidate: false });
          setMutateError(e instanceof Error ? e.message : 'Ошибка');
        }
      } else {
        setReminderSheetTask(task);
      }
    },
    [user, remindersHydrating, taskIdsWithUnsentReminder, mutateReminders, clearMutateError]
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

  const showLoading = user && isLoading && tasks.length === 0;
  const showErrorState = user && !isLoading && !!error;
  const showEmptyState = user && !isLoading && tasks.length === 0 && !error;
  const showContent = user && !showLoading && !showErrorState && tasks.length > 0;

  const openCreateSheet = useCallback(() => {
    setCreateFormKey((k) => k + 1);
    setCreateSheetOpen(true);
  }, []);

  const showFab = Boolean(user && !showLoading && !showErrorState);

  const prioritySafe = (p: string): Priority =>
    p === 'LOW' || p === 'MEDIUM' || p === 'HIGH' ? p : 'MEDIUM';

  /** «Habits» в подзаголовке: сервер `GET /categories/home-metrics` → `totalHabits` (= число HomeCategory). Пока метрика грузится — fallback на длину списка чипов. */
  const habitCount: number = homeMetrics?.totalHabits ?? categoriesList.length;

  return (
    <Layout>
      <div className="flex flex-col gap-0">
        {!isInTelegram && !user && (
          <div className="mx-auto max-w-md py-6">
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

        {user && (
          <>
            {/* Внутренний хедер Home + полоса категорий (как HomeScreen) */}
            <header className="sticky top-0 z-10 border-b border-[var(--syt-border)] bg-[var(--syt-background)]/80 py-6 backdrop-blur-lg">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-semibold text-[var(--syt-text)] mb-1">Tasks</h1>
                  <p className="text-sm text-[var(--syt-text-secondary)]">
                    Today · {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · {habitCount}{' '}
                    {habitCount === 1 ? 'habit' : 'habits'}
                  </p>
                </div>
                <Link
                  href="/settings"
                  className="shrink-0 p-2 rounded-lg bg-[var(--syt-card)] border border-[var(--syt-border)] text-[var(--syt-text-muted)] hover:text-[var(--syt-text)] hover:border-[var(--syt-accent)]/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
                  aria-label="Settings"
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              </div>

              <div
                className="mb-4 flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Habits"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[var(--syt-accent)] bg-[var(--syt-accent)]/20 text-[var(--syt-accent)]"
                  title="Habit"
                  aria-hidden
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                  </svg>
                </div>
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-muted)]"
                  aria-hidden
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-muted)]"
                  aria-hidden
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-muted)]"
                  aria-hidden
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--syt-border)] bg-[var(--syt-surface)] text-[var(--syt-text-muted)] hover:border-[var(--syt-accent)] hover:text-[var(--syt-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
                  aria-label="Add habit (coming soon)"
                  title="Add habit (coming soon)"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter(null)}
                  className={`flex h-12 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--syt-background)] ${
                    selectedCategoryFilter === null
                      ? 'bg-[var(--syt-accent)] text-white ring-2 ring-[var(--syt-accent)] ring-offset-2 ring-offset-[var(--syt-background)]'
                      : 'bg-[var(--syt-card)] text-[var(--syt-text-secondary)] border border-[var(--syt-border)] hover:border-[var(--syt-accent)]/50 hover:text-[var(--syt-text)]'
                  }`}
                  aria-pressed={selectedCategoryFilter === null}
                  aria-label="All categories"
                >
                  All
                </button>
                {showCategoriesLoadingEmpty && (
                  <div
                    className="flex min-h-12 min-w-[8rem] flex-1 items-center justify-center rounded-xl border border-[var(--syt-border)] bg-[var(--syt-surface)] px-4 py-2"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="text-xs text-[var(--syt-text-muted)]">Loading categories…</p>
                  </div>
                )}
                {showCategoriesErrorEmpty && (
                  <div className="flex min-h-12 min-w-0 flex-1 flex-col items-stretch justify-center gap-2 rounded-xl border border-[var(--syt-border)] bg-[var(--syt-surface)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-[var(--syt-text-secondary)]">
                      Couldn&apos;t load categories. Check connection and try again.
                    </p>
                    <button
                      type="button"
                      onClick={() => void mutateCategories()}
                      className="shrink-0 self-start rounded-lg border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-1.5 text-xs font-medium text-[var(--syt-accent)] hover:border-[var(--syt-accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] sm:self-center"
                    >
                      Retry
                    </button>
                  </div>
                )}
                {!showCategoriesLoadingEmpty &&
                  !showCategoriesErrorEmpty &&
                  categoriesList.map((c) => (
                    <HomeCategoryFilterChip
                      key={c.id}
                      category={c}
                      selected={selectedCategoryFilter === c.id}
                      onSelect={() => setSelectedCategoryFilter(c.id)}
                      onEdit={(cat) => setCategorySheet({ mode: 'edit', category: cat })}
                    />
                  ))}
                {categoriesError && categoriesData !== undefined && (
                  <button
                    type="button"
                    onClick={() => void mutateCategories()}
                    className="shrink-0 rounded-lg border border-[var(--syt-error)]/40 bg-[var(--syt-card)] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--syt-error)] hover:bg-[var(--syt-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-error)]"
                    title={categoriesError instanceof Error ? categoriesError.message : 'Refresh categories'}
                  >
                    Refresh
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCategorySheet({ mode: 'create' })}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--syt-border)] bg-[var(--syt-surface)] text-[var(--syt-text-muted)] hover:border-[var(--syt-accent)] hover:text-[var(--syt-accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
                  aria-label="Add category"
                  title="Add category"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </header>

            <div className="flex flex-col gap-6 pt-6">
              {showLoading && (
                <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-8 flex items-center justify-center min-h-[120px]">
                  <p className="text-sm text-[var(--syt-text-secondary)]">Loading tasks…</p>
                </div>
              )}

              {showErrorState && (
                <div className="rounded-[14px] border border-[var(--syt-error)] bg-[var(--syt-card)] p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-base text-[var(--syt-text)]">Something went wrong</p>
                    {mutateError && (
                      <button
                        type="button"
                        onClick={clearMutateError}
                        className="shrink-0 text-[var(--syt-text-muted)] hover:text-[var(--syt-text)] text-lg leading-none"
                        aria-label="Dismiss error"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-[var(--syt-text-secondary)]">Please try again.</p>
                  <Button variant="secondary" className="rounded-xl w-fit" onClick={() => mutate()}>
                    Refresh page
                  </Button>
                </div>
              )}

              {showEmptyState && (
                <HomeEmptyState
                  className="pb-[calc(4rem+env(safe-area-inset-bottom,0px))] sm:pb-12"
                  icon={
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  title="No tasks yet"
                  description="Start planning your day by adding your first task"
                  primaryAction={{
                    label: 'Add Task',
                    onClick: openCreateSheet,
                    icon: (
                      <svg
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    ),
                  }}
                />
              )}

              {showContent && (
                <SytAccordion
                  type="multiple"
                  className="border-b border-[var(--syt-border)] pb-1"
                  defaultValue={['today']}
                >
                  {ACCORDION_SECTIONS.map(({ key: sectionKey, title }) => {
                    const list = buckets[sectionKey];
                    const count = list.length;

                    return (
                      <SytAccordionItem key={sectionKey} value={sectionKey}>
                        <SytAccordionTrigger count={count}>{title}</SytAccordionTrigger>
                        <SytAccordionContent>
                          {list.length === 0 ? (
                            <p className="text-sm text-[var(--syt-text-secondary)] py-2">
                              No tasks in this section.
                            </p>
                          ) : (
                            list.map((task) => {
                              const isCompleted = task.status === 'COMPLETED';
                              const timeStr = timeForTask(task);
                              return (
                                <HomeTaskCard
                                  key={task.id}
                                  title={task.title}
                                  titleHref={`/tasks/${task.id}`}
                                  description={task.description}
                                  reminderActive={taskIdsWithUnsentReminder.has(task.id)}
                                  reminderTime={timeStr}
                                  reminderToggleDisabled={remindersHydrating}
                                  onReminderPress={() => void handleReminderPress(task)}
                                  priority={prioritySafe(task.priority)}
                                  statusLabel={statusLabel(task.status)}
                                  dueDateChip={
                                    task.dueDate && !timeStr ? formatDate(task.dueDate) : null
                                  }
                                  completed={isCompleted}
                                  onToggleComplete={() => handleToggle(task)}
                                  onDelete={() => void handleDelete(task)}
                                  footerLine={
                                    sectionKey !== 'today' && task.dueDate
                                      ? isCompleted
                                        ? formatDate(task.dueDate)
                                        : formatDue(task.dueDate)
                                      : null
                                  }
                                />
                              );
                            })
                          )}
                        </SytAccordionContent>
                      </SytAccordionItem>
                    );
                  })}
                </SytAccordion>
              )}
            </div>
          </>
        )}

        {showFab && (
          <button
            type="button"
            onClick={openCreateSheet}
            className="fixed z-[95] right-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--syt-accent)] bg-[var(--syt-accent)] text-white shadow-[var(--syt-shadow-soft)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)] focus:ring-offset-2 focus:ring-offset-[var(--syt-background)]"
            style={{
              /* Над нижним таббаром Layout: h-[52px] + safe-area-pb на nav */
              bottom: 'calc(52px + env(safe-area-inset-bottom, 0px) + 16px)',
            }}
            aria-label="Add task"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

        {user && (
          <HomeReminderSheet
            open={reminderSheetTask !== null}
            onClose={() => setReminderSheetTask(null)}
            onSave={handleSaveReminder}
          />
        )}

        {user && (
          <BottomSheet open={createSheetOpen} onClose={() => setCreateSheetOpen(false)} title="New task">
            <CreateTaskForm
              key={createFormKey}
              userId={user.id}
              categories={categoriesData === undefined ? undefined : categoriesList}
              defaultCategoryId={selectedCategoryFilter}
              onCancel={() => setCreateSheetOpen(false)}
              onSuccess={() => setCreateSheetOpen(false)}
            />
          </BottomSheet>
        )}

        {user && categorySheet && (
          <HomeCategoryEditSheet
            open
            onClose={() => setCategorySheet(null)}
            userId={user.id}
            mode={categorySheet.mode}
            category={categorySheet.mode === 'edit' ? categorySheet.category : null}
            onSaved={() => {
              void mutateCategories();
              void mutateHomeMetrics();
            }}
          />
        )}
      </div>
    </Layout>
  );
}
