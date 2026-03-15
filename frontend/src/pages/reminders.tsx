'use client';

import { useState, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useUser } from '@/context/UserContext';
import useSWR from 'swr';
import {
  getRemindersForUser,
  createReminder,
  deleteReminder,
  type Reminder,
} from '@/api/reminders';
import { getTasks, type Task } from '@/api/tasks';

export default function RemindersPage() {
  const { user } = useUser();
  const [taskId, setTaskId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: reminders = [], mutate } = useSWR<Reminder[]>(
    user?.id ? ['reminders', user.id] : null,
    () => getRemindersForUser(user!.id),
    { revalidateOnFocus: true }
  );

  const { data: tasks = [] } = useSWR<Task[]>(
    user?.id ? ['tasks', user.id] : null,
    () => getTasks(user!.id),
    { revalidateOnFocus: true }
  );

  const hasReminders = reminders.length > 0;

  const handleCreate = useCallback(async () => {
    if (!user || !taskId.trim() || !date || !time) return;
    setError(null);
    setCreating(true);
    try {
      const remindAt = new Date(`${date}T${time}`).toISOString();
      await createReminder({ taskId: taskId.trim(), remindAt });
      setTaskId('');
      setDate('');
      setTime('');
      mutate();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create reminder');
    } finally {
      setCreating(false);
    }
  }, [user, taskId, date, time, mutate]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteReminder(id);
        mutate((prev) => (prev ?? []).filter((r) => r.id !== id), {
          revalidate: false,
        });
      } catch {
        // TODO: toast
      }
    },
    [mutate]
  );

  const formatRemindAt = (remindAt: string) => {
    const d = new Date(remindAt);
    const dateStr = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4 max-w-[640px] mx-auto min-h-full">
        <h1 className="text-xl font-semibold text-[var(--syt-text)]">
          Reminders
        </h1>

        {!user && (
          <p className="text-sm text-[var(--syt-text-secondary)]">
            Open in Telegram to see reminders.
          </p>
        )}

        {user && !hasReminders && (
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] flex items-center justify-center min-h-[100px] px-4">
            <p className="text-sm text-[var(--syt-text-secondary)] text-center">
              Reminders will appear here soon
            </p>
          </div>
        )}

        {user && hasReminders && (
          <div className="flex flex-col gap-3">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex flex-col gap-2"
              >
                <p className="font-semibold text-sm text-[var(--syt-text)]">
                  {r.task?.title ?? 'Task'}
                </p>
                <p className="text-xs text-[var(--syt-text-secondary)]">
                  {formatRemindAt(r.remindAt)}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[10px] font-medium px-2 py-1 rounded ${
                      r.sent
                        ? 'bg-[#1a2e20] text-[#22c55e]'
                        : 'bg-[#395c7d] text-[#b2d6f6]'
                    }`}
                  >
                    {r.sent ? 'Sent' : 'Scheduled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="text-xs font-medium text-[var(--syt-error)] hover:underline"
                  >
                    Delete reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="flex flex-col gap-6">
            <p className="font-semibold text-sm text-[var(--syt-text)]">
              Create reminder
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--syt-text)]">
                Select task
              </label>
              <select
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-3 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
              >
                <option value="">Choose task...</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--syt-text)]">
                Select date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-3 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--syt-text)]">
                Select time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-3 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
              />
            </div>
            {error && (
              <p className="text-xs text-[var(--syt-error)]">{error}</p>
            )}
            <Button
              variant="primary"
              className="w-full rounded-xl py-3"
              onClick={handleCreate}
              disabled={creating || !taskId || !date || !time}
            >
              {creating ? 'Creating…' : 'Create reminder'}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
