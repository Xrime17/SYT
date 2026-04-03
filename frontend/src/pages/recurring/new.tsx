'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import {
  RecurringRuleFields,
  buildCreateRecurringPayload,
  defaultRecurringFieldValues,
  recurringFieldsValid,
  type RecurringFieldValues,
} from '@/components/RecurringRuleFields';
import { useUser } from '@/context/UserContext';
import useSWR from 'swr';
import { fetchTasksListForSwrKey, tasksListSwrKey, type Task } from '@/api/tasks';
import { createRecurring } from '@/api/recurring';

export default function NewRecurringPage() {
  const router = useRouter();
  const { user } = useUser();
  const [taskId, setTaskId] = useState('');
  const [recurringValues, setRecurringValues] = useState<RecurringFieldValues>(() =>
    defaultRecurringFieldValues()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchRecurring = useCallback((patch: Partial<RecurringFieldValues>) => {
    setRecurringValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const { data: tasks = [] } = useSWR(
    user?.id ? tasksListSwrKey(user.id, null) : null,
    fetchTasksListForSwrKey,
    { revalidateOnFocus: true }
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !taskId.trim()) return;
      if (!recurringFieldsValid(recurringValues)) {
        setError('For weekly recurrence, pick at least one day.');
        return;
      }
      setError(null);
      setLoading(true);
      try {
        await createRecurring(buildCreateRecurringPayload(taskId.trim(), recurringValues));
        await mutate(['recurring', user.id]);
        router.push('/recurring');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create rule');
      } finally {
        setLoading(false);
      }
    },
    [user, taskId, recurringValues, router]
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
              {tasks.map((t: Task) => (
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

          <RecurringRuleFields value={recurringValues} onChange={patchRecurring} />

          {error && (
            <p className="text-sm text-[var(--syt-error)]">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-xl py-3"
            disabled={loading || !taskId.trim() || !recurringFieldsValid(recurringValues)}
          >
            {loading ? 'Creating…' : 'Add recurring rule'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
