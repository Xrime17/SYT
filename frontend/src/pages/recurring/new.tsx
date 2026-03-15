'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useUser } from '@/context/UserContext';
import useSWR from 'swr';
import { getTasks, type Task } from '@/api/tasks';
import { createRecurring } from '@/api/recurring';

const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'CUSTOM', label: 'Custom interval' },
] as const;

const WEEKDAYS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

export default function NewRecurringPage() {
  const router = useRouter();
  const { user } = useUser();
  const [taskId, setTaskId] = useState('');
  const [frequency, setFrequency] = useState<(typeof FREQUENCIES)[number]['value']>('WEEKLY');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1]); // Monday default
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [intervalDays, setIntervalDays] = useState(7);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: tasks = [] } = useSWR<Task[]>(
    user?.id ? ['tasks', user.id] : null,
    () => getTasks(user!.id),
    { revalidateOnFocus: true }
  );

  const toggleDay = (d: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort((a, b) => a - b)
    );
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !taskId.trim()) return;
      setError(null);
      setLoading(true);
      try {
        const payload: {
          taskId: string;
          frequency: string;
          interval?: number;
          daysOfWeek?: number[];
          endDate?: string;
        } = {
          taskId: taskId.trim(),
          frequency,
        };
        if (frequency === 'WEEKLY' && daysOfWeek.length > 0) {
          payload.daysOfWeek = daysOfWeek;
        }
        if (frequency === 'MONTHLY') {
          payload.interval = Math.max(1, Math.min(31, dayOfMonth));
        }
        if (frequency === 'CUSTOM') {
          payload.interval = Math.max(1, intervalDays);
        }
        if (endDate) {
          payload.endDate = new Date(endDate).toISOString();
        }
        await createRecurring(payload);
        router.push('/recurring');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create rule');
      } finally {
        setLoading(false);
      }
    },
    [user, taskId, frequency, daysOfWeek, dayOfMonth, intervalDays, endDate, router]
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
      <div className="flex flex-col gap-6 max-w-[640px] mx-auto">
        <header className="flex items-center gap-3 h-12">
          <Link
            href="/recurring"
            className="w-10 h-10 rounded-[10px] bg-[var(--syt-card)] flex items-center justify-center text-[var(--syt-text)] font-medium text-xl hover:opacity-90"
            aria-label="Back"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-[var(--syt-text)]">
            Add recurring rule
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Task *
            </label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              required
              className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            >
              <option value="">Choose task...</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            {tasks.length === 0 && (
              <p className="text-xs text-[var(--syt-text-muted)]">
                Create a task first in Tasks, then use it here.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              Frequency *
            </label>
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFrequency(f.value)}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                    frequency === f.value
                      ? 'bg-[var(--syt-accent)] text-white'
                      : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-secondary)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {frequency === 'WEEKLY' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--syt-text)]">
                Days of week
              </label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDay(d.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      daysOfWeek.includes(d.value)
                        ? 'bg-[var(--syt-accent)] text-white'
                        : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-secondary)]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === 'MONTHLY' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--syt-text)]">
                Day of month (1–31)
              </label>
              <input
                type="number"
                min={1}
                max={31}
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)]"
              />
            </div>
          )}

          {frequency === 'CUSTOM' && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[var(--syt-text)]">
                Repeat every (days)
              </label>
              <input
                type="number"
                min={1}
                value={intervalDays}
                onChange={(e) => setIntervalDays(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)]"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">
              End date (optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--syt-error)]">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-xl py-3"
            disabled={loading || !taskId.trim() || (frequency === 'WEEKLY' && daysOfWeek.length === 0)}
          >
            {loading ? 'Creating…' : 'Add recurring rule'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
