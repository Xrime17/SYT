'use client';

/**
 * Home — хедер Tasks (аватар + настройки на мобиле), привычки, 4 аккордеона.
 * На мобиле верхний chrome Layout скрыт; задачи — `GET /tasks/:userId` без фильтра категории.
 * Напоминания: `GET /reminders/user`, `POST /reminders/quick`, `POST /reminders`.
 * Привычки: `GET /habits/user/:userId`, `POST /habits/.../increment`.
 */

import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { BottomSheet } from '@/components/BottomSheet';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HomeEmptyState } from '@/components/HomeEmptyState';
import { HomeTaskCard } from '@/components/HomeTaskCard';
import { HomeReminderSheet } from '@/components/HomeReminderSheet';
import { CreateHabitForm } from '@/components/CreateHabitForm';
import { HabitDetailSheet } from '@/components/HabitDetailSheet';
import { HabitTapCircle } from '@/components/HabitTapCircle';
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
import { getHomeSubtitleMetrics } from '@/api/home-metrics';
import { getHabits, incrementHabit, type HabitListItem } from '@/api/habits';
import {
  getRemindersForUser,
  toggleHomeQuickReminder,
  createReminder,
  type Reminder,
} from '@/api/reminders';
import { groupHomeLists, type HomeListKey } from '@/utils/home-task-groups';
import { getHomeCategories } from '@/api/home-categories';

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
  const [reminderSheetTask, setReminderSheetTask] = useState<Task | null>(null);
  const [habitCreateOpen, setHabitCreateOpen] = useState(false);
  const [createHabitKey, setCreateHabitKey] = useState(0);
  const [habitDetailId, setHabitDetailId] = useState<string | null>(null);

  const tasksSwrKey = user?.id ? tasksListSwrKey(user.id, null) : null;

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

  const { data: categoriesData } = useSWR(
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

  const { data: habitsData, mutate: mutateHabits } = useSWR(
    user?.id ? (['habits', user.id] as const) : null,
    ([, uid]) => getHabits(uid),
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 5000,
    }
  );

  const habits = useMemo(() => habitsData ?? [], [habitsData]);
  const categoriesList = categoriesData ?? [];

  const detailHabit = useMemo(
    () => (habitDetailId ? habits.find((h) => h.id === habitDetailId) ?? null : null),
    [habitDetailId, habits]
  );

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

  const handleHabitTap = useCallback(
    async (h: HabitListItem) => {
      if (!user) return;
      clearMutateError();
      try {
        await incrementHabit(h.id, user.id);
        await mutateHabits();
        await mutateHomeMetrics();
      } catch (e) {
        setMutateError(e instanceof Error ? e.message : 'Ошибка');
      }
    },
    [user, mutateHabits, mutateHomeMetrics, clearMutateError]
  );

  const openHabitCreateSheet = useCallback(() => {
    setCreateHabitKey((k) => k + 1);
    setHabitCreateOpen(true);
  }, []);

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

  /** Активные привычки: `GET /categories/home-metrics` → `totalHabits` (metric `activeHabitsCount`). */
  const habitCount: number = homeMetrics?.totalHabits ?? 0;

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
            {/* Внутренний хедер Home + привычки (без полосы категорий — компактнее) */}
            <header className="sticky top-0 z-10 border-b border-[var(--syt-border)] bg-[var(--syt-background)]/80 py-3 backdrop-blur-lg sm:py-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-semibold text-[var(--syt-text)] mb-1">Tasks</h1>
                  <p className="text-sm text-[var(--syt-text-secondary)]">
                    Today · {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · {habitCount}{' '}
                    {habitCount === 1 ? 'habit' : 'habits'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--syt-accent)] text-sm font-semibold text-white sm:hidden"
                    aria-hidden
                    title={user.firstName ?? 'Profile'}
                  >
                    {user.firstName?.charAt(0) || '?'}
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
              </div>

              <div
                className="mb-2 flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Habits"
              >
                {habits.map((h) => (
                  <HabitTapCircle
                    key={h.id}
                    habit={h}
                    onTap={() => void handleHabitTap(h)}
                    onLongPress={() => setHabitDetailId(h.id)}
                  />
                ))}
                <button
                  type="button"
                  onClick={openHabitCreateSheet}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--syt-border)] bg-[var(--syt-surface)] text-[var(--syt-text-muted)] hover:border-[var(--syt-accent)] hover:text-[var(--syt-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
                  aria-label="Add habit"
                  title="Add habit"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </header>

            <div className="flex flex-col gap-6 pt-3 sm:pt-6">
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

        {showFab &&
          typeof document !== 'undefined' &&
          createPortal(
            <button
              type="button"
              onClick={openCreateSheet}
              className="fixed z-[95] right-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--syt-accent)] bg-[var(--syt-accent)] text-white shadow-[var(--syt-shadow-soft)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)] focus:ring-offset-2 focus:ring-offset-[var(--syt-background)]"
              style={{
                bottom: 'calc(52px + env(safe-area-inset-bottom, 0px) + 16px)',
              }}
              aria-label="Add task"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>,
            document.body
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
              defaultCategoryId={null}
              onCancel={() => setCreateSheetOpen(false)}
              onSuccess={() => setCreateSheetOpen(false)}
            />
          </BottomSheet>
        )}

        {user && (
          <BottomSheet open={habitCreateOpen} onClose={() => setHabitCreateOpen(false)} title="New habit">
            <CreateHabitForm
              key={createHabitKey}
              userId={user.id}
              onCancel={() => setHabitCreateOpen(false)}
              onSuccess={() => setHabitCreateOpen(false)}
            />
          </BottomSheet>
        )}

        {user && (
          <HabitDetailSheet
            open={detailHabit !== null}
            onClose={() => setHabitDetailId(null)}
            userId={user.id}
            habit={detailHabit}
          />
        )}

      </div>
    </Layout>
  );
}
