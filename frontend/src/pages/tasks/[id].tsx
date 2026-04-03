'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import {
  RecurringRuleFields,
  buildCreateRecurringPayload,
  buildUpdateRecurringPayload,
  defaultRecurringFieldValues,
  recurringFieldsValid,
  recurringRuleToFieldValues,
  type RecurringFieldValues,
} from '@/components/RecurringRuleFields';
import { useUser } from '@/context/UserContext';
import { getTaskById, updateTask, type Task } from '@/api/tasks';
import {
  createRecurring,
  deleteRecurring,
  getRecurringByTask,
  updateRecurring,
} from '@/api/recurring';
import { getDateBounds, clampDate } from '@/utils/date-bounds';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const TASK_TYPES = ['TASK', 'GOAL', 'NOTE'] as const;
type Priority = (typeof PRIORITIES)[number];
type TaskType = (typeof TASK_TYPES)[number];

function toDateInput(iso: string | null | undefined): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [task, setTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [taskType, setTaskType] = useState<TaskType>('TASK');
  const [dueDate, setDueDate] = useState('');
  const { minDate, maxDate } = useMemo(() => getDateBounds(), []);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cycleEnabled, setCycleEnabled] = useState(false);
  const [hasExistingRecurring, setHasExistingRecurring] = useState(false);
  const [recurringValues, setRecurringValues] = useState<RecurringFieldValues>(() =>
    defaultRecurringFieldValues()
  );

  const patchRecurring = useCallback((patch: Partial<RecurringFieldValues>) => {
    setRecurringValues((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    let cancelled = false;
    setLoadingTask(true);
    setFetchError(null);
    Promise.all([getTaskById(id), getRecurringByTask(id).catch(() => null)])
      .then(([t, rule]) => {
        if (cancelled) return;
        setTask(t);
        setTitle(t.title);
        setDescription(t.description ?? '');
        setPriority(
          PRIORITIES.includes(t.priority as Priority) ? (t.priority as Priority) : 'MEDIUM'
        );
        setTaskType(TASK_TYPES.includes(t.type as TaskType) ? (t.type as TaskType) : 'TASK');
        setDueDate(toDateInput(t.dueDate));
        if (rule) {
          setHasExistingRecurring(true);
          setCycleEnabled(true);
          setRecurringValues(recurringRuleToFieldValues(rule));
        } else {
          setHasExistingRecurring(false);
          setCycleEnabled(false);
          setRecurringValues(defaultRecurringFieldValues());
        }
      })
      .catch((e) => {
        if (!cancelled) setFetchError(e instanceof Error ? e.message : 'Failed to load task');
      })
      .finally(() => {
        if (!cancelled) setLoadingTask(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const titleError = touched && !title.trim() ? 'Title is required' : null;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!user || !task || !title.trim()) return;
      if (cycleEnabled && !recurringFieldsValid(recurringValues)) {
        setError('For weekly recurrence, pick at least one day.');
        return;
      }
      setError(null);
      setSaving(true);
      try {
        await updateTask(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          type: taskType,
          dueDate: dueDate || null,
        });
        await mutate(
          (key) => Array.isArray(key) && key[0] === 'tasks' && key[1] === user.id,
          undefined,
          { revalidate: true }
        );

        if (cycleEnabled) {
          try {
            if (hasExistingRecurring) {
              await updateRecurring(task.id, buildUpdateRecurringPayload(recurringValues));
            } else {
              await createRecurring(buildCreateRecurringPayload(task.id, recurringValues));
              setHasExistingRecurring(true);
            }
          } catch (recErr) {
            setError(recErr instanceof Error ? recErr.message : 'Could not save cycle');
            setSaving(false);
            return;
          }
        } else if (hasExistingRecurring) {
          try {
            await deleteRecurring(task.id);
          } catch {
            /* no rule */
          }
          setHasExistingRecurring(false);
        }

        await mutate(
          (key) => Array.isArray(key) && key[0] === 'recurring' && key[1] === user.id,
          undefined,
          { revalidate: true }
        );
        router.push('/tasks');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setSaving(false);
      }
    },
    [
      user,
      task,
      title,
      description,
      priority,
      taskType,
      dueDate,
      router,
      cycleEnabled,
      recurringValues,
      hasExistingRecurring,
    ]
  );

  if (!user) {
    return (
      <Layout>
        <p className="text-sm text-[var(--syt-text-secondary)]">Open in Telegram.</p>
      </Layout>
    );
  }

  if (loadingTask) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-sm text-[var(--syt-text-secondary)]">Loading…</p>
        </div>
      </Layout>
    );
  }

  if (fetchError || !task) {
    return (
      <Layout>
        <div className="flex flex-col gap-4 items-center justify-center min-h-[200px]">
          <p className="text-sm text-[var(--syt-error)]">{fetchError ?? 'Task not found'}</p>
          <Link href="/tasks">
            <Button variant="secondary" className="rounded-xl">
              Back to tasks
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <header className="flex items-center gap-3 h-12">
          <Link
            href="/tasks"
            className="w-10 h-10 rounded-[10px] bg-[var(--syt-card)] flex items-center justify-center text-[var(--syt-text)] font-medium text-xl hover:opacity-90"
            aria-label="Back"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-[var(--syt-text)] truncate flex-1">
            {task.title}
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Enter task title"
              className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            />
            {titleError && <p className="text-xs text-[var(--syt-error)]">Title is required</p>}
          </div>

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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">Priority</label>
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">Task type</label>
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--syt-text)]">Due date (optional)</label>
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

          <div className="flex flex-col gap-4">
            <Checkbox
              id="edit-task-cycle"
              label="Цикл"
              checked={cycleEnabled}
              onCheckedChange={(v) => {
                setCycleEnabled(v);
                if (!v) setRecurringValues(defaultRecurringFieldValues());
              }}
              className="text-sm font-medium text-[var(--syt-text)]"
            />
            {cycleEnabled && (
              <RecurringRuleFields value={recurringValues} onChange={patchRecurring} hideTopBorder />
            )}
          </div>

          {error && <p className="text-sm text-[var(--syt-error)]">{error}</p>}

          <Button
            type="submit"
            disabled={saving || (cycleEnabled && !recurringFieldsValid(recurringValues))}
            variant="primary"
            className="w-full rounded-xl py-2.5"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
