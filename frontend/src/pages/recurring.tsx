'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useUser } from '@/context/UserContext';
import {
  getRecurringRulesForUser,
  deleteRecurring,
  type RecurringRuleForUser,
} from '@/api/recurring';

export default function RecurringPage() {
  const { user } = useUser();
  const { data: rules = [], mutate } = useSWR<RecurringRuleForUser[]>(
    user?.id ? ['recurring', user.id] : null,
    () => getRecurringRulesForUser(user!.id),
    { revalidateOnFocus: true }
  );
  const hasRules = rules.length > 0;

  const handleDelete = async (rule: RecurringRuleForUser) => {
    if (!confirm('Delete this recurring rule?')) return;
    try {
      await deleteRecurring(rule.taskId);
      mutate((prev) => (prev ?? []).filter((r) => r.id !== rule.id), {
        revalidate: false,
      });
    } catch {
      // TODO: toast or inline error
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-[var(--syt-text)]">
          Recurring
        </h1>

        {!user && (
          <p className="text-sm text-[var(--syt-text-secondary)]">
            Open in Telegram to see your rules.
          </p>
        )}

        {user && !hasRules && (
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] flex items-center justify-center min-h-[120px] px-4">
            <p className="text-sm text-[var(--syt-text-secondary)] text-center">
              Recurring rules will appear here
            </p>
          </div>
        )}

        {user && hasRules && (
          <div className="flex flex-col gap-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex flex-col gap-2"
              >
                <p className="font-semibold text-sm text-[var(--syt-text)]">
                  {rule.taskTitle}
                </p>
                <p className="text-xs text-[var(--syt-text-secondary)]">
                  {rule.frequencyLabel}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs font-medium text-[var(--syt-accent)] hover:underline"
                  >
                    Edit rule
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rule)}
                    className="text-xs font-medium text-[var(--syt-error)] hover:underline"
                  >
                    Delete rule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/recurring/new" className="block">
          <Button variant="primary" className="w-full rounded-xl py-3">
            + Add recurring rule
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
