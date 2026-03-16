'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useUser } from '@/context/UserContext';
import { createTask } from '@/api/tasks';
import { getDateBounds, clampDate } from '@/utils/date-bounds';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const TASK_TYPES = ['TASK', 'GOAL', 'NOTE'] as const;

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>('MEDIUM');
  const [taskType, setTaskType] = useState<(typeof TASK_TYPES)[number]>('TASK');
  const [dueDate, setDueDate] = useState('');
  const { minDate, maxDate } = useMemo(() => getDateBounds(), []);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleError = touched && !title.trim() ? 'Title is required' : null;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!user || !title.trim()) return;
      setError(null);
      setLoading(true);
      try {
        await createTask({
          userId: user.id,
          title: title.trim(),
          description: description.trim() || undefined,
          type: taskType,
          priority,
          dueDate: dueDate || undefined,
        });
        await mutate(['tasks', user.id]);
        router.push('/tasks');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    },
    [user, title, description, taskType, priority, dueDate, router]
  );

  if (!user) {
    return (
      <Layout>
        <p className="text-sm text-[var(--syt-text-secondary)]">Open in Telegram.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* Header — Back + New task */}
        <header className="flex items-center gap-3 h-12">
          <Link
            href="/tasks"
            className="w-10 h-10 rounded-[10px] bg-[var(--syt-card)] flex items-center justify-center text-[var(--syt-text)] font-medium text-xl hover:opacity-90"
            aria-label="Back"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-[var(--syt-text)]">
            New task
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title * */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Enter task title"
              className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            />
            {titleError && (
              <p className="text-xs text-[var(--syt-error)]">Title is required</p>
            )}
          </div>

          {/* Description (optional) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              rows={3}
              className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)] resize-y min-h-[77px]"
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                    priority === p
                      ? 'bg-[var(--syt-accent)] text-white'
                      : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-secondary)] hover:border-[var(--syt-accent)]/50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Task type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Task type
            </label>
            <div className="flex flex-wrap gap-2">
              {TASK_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTaskType(t)}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                    taskType === t
                      ? 'bg-[var(--syt-accent)] text-white'
                      : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-secondary)] hover:border-[var(--syt-accent)]/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Due date (optional) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Due date (optional)
            </label>
            <input
              type="date"
              value={dueDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={() => setDueDate((v) => clampDate(v, minDate, maxDate))}
              className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--syt-error)]">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full rounded-xl py-2.5"
          >
            {loading ? 'Creating…' : 'Add task'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
