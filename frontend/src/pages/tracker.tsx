'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useUser } from '@/context/UserContext';
import useSWR from 'swr';
import { getTasks, type Task } from '@/api/tasks';

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function TrackerPage() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const dateStr = useMemo(() => toDateStr(selectedDate), [selectedDate]);

  const { data: tasks = [] } = useSWR<Task[]>(
    user?.id && dateStr ? ['tasks', user.id, dateStr] : null,
    () => getTasks(user!.id, dateStr),
    { revalidateOnFocus: true }
  );

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  const label = isToday
    ? `Today – ${selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
    : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const goPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const goNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const total = tasks.length;
  const hasTasks = total > 0;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-[var(--syt-text)]">
          Tracker for today
        </h1>

        {!user && (
          <p className="text-sm text-[var(--syt-text-secondary)]">
            Open in Telegram to see your tracker.
          </p>
        )}

        {user && (
          <>
            <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-lg border border-[var(--syt-border)] bg-[#2d3239] px-4 py-2 text-sm font-medium text-[var(--syt-text)] hover:opacity-90"
                aria-label="Previous day"
              >
                ← Prev
              </button>
              <span className="flex-1 text-center text-sm font-semibold text-[var(--syt-text)] truncate">
                {label}
              </span>
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg border border-[var(--syt-border)] bg-[#2d3239] px-4 py-2 text-sm font-medium text-[var(--syt-text)] hover:opacity-90"
                aria-label="Next day"
              >
                Next →
              </button>
            </div>

            <p className="text-sm text-[var(--syt-text-secondary)]">
              {completed} / {total} tasks completed
            </p>

            {!hasTasks && (
              <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-8 flex flex-col items-center justify-center min-h-[200px] gap-6">
                <span className="text-4xl" role="img" aria-hidden>
                  📋
                </span>
                <p className="font-semibold text-base text-[var(--syt-text)]">
                  No tasks for today
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/tasks/new">
                    <Button
                      className="rounded-3xl bg-[var(--syt-warning)] text-white border-0 hover:opacity-90"
                    >
                      Add task
                    </Button>
                  </Link>
                  <Link href="/tasks">
                    <Button
                      variant="primary"
                      className="rounded-3xl border border-[var(--syt-border)]"
                    >
                      All tasks
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {hasTasks && (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4"
                  >
                    <p
                      className={`font-medium text-sm text-[var(--syt-text)] ${
                        task.status === 'COMPLETED' ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-[var(--syt-text-secondary)] mt-1">
                      {task.status === 'COMPLETED' ? 'Done' : 'Active'}
                    </p>
                  </div>
                ))}
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/tasks/new">
                    <Button
                      className="rounded-3xl bg-[var(--syt-warning)] text-white border-0 hover:opacity-90"
                    >
                      Add task
                    </Button>
                  </Link>
                  <Link href="/tasks">
                    <Button
                      variant="primary"
                      className="rounded-3xl border border-[var(--syt-border)]"
                    >
                      All tasks
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
