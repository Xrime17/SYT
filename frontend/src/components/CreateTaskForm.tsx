'use client';

import { useCallback, useMemo, useState } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import {
  RecurringRuleFields,
  buildCreateRecurringPayload,
  defaultRecurringFieldValues,
  recurringFieldsValid,
  type RecurringFieldValues,
} from '@/components/RecurringRuleFields';
import { createTask, type Task } from '@/api/tasks';
import { createRecurring } from '@/api/recurring';
import type { HomeCategory } from '@/api/home-categories';
import { getDateBounds, clampDate } from '@/utils/date-bounds';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const TASK_TYPES = ['TASK', 'GOAL', 'NOTE'] as const;

export type CreateTaskFormProps = {
  userId: string;
  /** Если передан (в т.ч. пустой массив после загрузки) — показываем выбор категории Home. */
  categories?: HomeCategory[];
  /** Предвыбранная категория (например активный фильтр на Home). */
  defaultCategoryId?: string | null;
  /** Чекбокс «Цикл» (по умолчанию вкл.: Home, /tasks/new). Передайте `false` чтобы скрыть (редко). */
  allowRecurring?: boolean;
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
};

export function CreateTaskForm({
  userId,
  categories,
  defaultCategoryId,
  allowRecurring = true,
  onSuccess,
  onCancel,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>('MEDIUM');
  const [taskType, setTaskType] = useState<(typeof TASK_TYPES)[number]>('TASK');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState(() => defaultCategoryId ?? '');
  const { minDate, maxDate } = useMemo(() => getDateBounds(), []);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cycleEnabled, setCycleEnabled] = useState(false);
  const [recurringValues, setRecurringValues] = useState<RecurringFieldValues>(() =>
    defaultRecurringFieldValues()
  );

  const patchRecurring = useCallback((patch: Partial<RecurringFieldValues>) => {
    setRecurringValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const titleError = touched && !title.trim() ? 'Title is required' : null;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!title.trim()) return;
      if (allowRecurring && cycleEnabled && !recurringFieldsValid(recurringValues)) {
        setError('For weekly recurrence, pick at least one day.');
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const task = await createTask({
          userId,
          title: title.trim(),
          description: description.trim() || undefined,
          type: taskType,
          priority,
          dueDate: dueDate || undefined,
          ...(categoryId ? { categoryId } : {}),
        });
        await mutate(
          (key) => Array.isArray(key) && key[0] === 'tasks' && key[1] === userId,
          undefined,
          { revalidate: true }
        );
        if (allowRecurring && cycleEnabled) {
          try {
            await createRecurring(buildCreateRecurringPayload(task.id, recurringValues));
            await mutate(
              (key) => Array.isArray(key) && key[0] === 'recurring' && key[1] === userId,
              undefined,
              { revalidate: true }
            );
          } catch (recErr) {
            setError(
              recErr instanceof Error
                ? `Task created, but cycle was not saved: ${recErr.message}`
                : 'Task created, but cycle was not saved.'
            );
            return;
          }
        }
        onSuccess?.(task);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    },
    [
      userId,
      title,
      description,
      taskType,
      priority,
      dueDate,
      categoryId,
      allowRecurring,
      cycleEnabled,
      recurringValues,
      onSuccess,
    ]
  );

  return (
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

      {categories !== undefined && (
        <div className="flex flex-col gap-2">
          <label htmlFor="create-task-category" className="text-sm font-medium text-[var(--syt-text)]">
            Category (optional)
          </label>
          <select
            id="create-task-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji ? `${c.emoji} ` : ''}
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--syt-text)]">Description (optional)</label>
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

      {allowRecurring && (
        <div className="flex flex-col gap-4">
          <Checkbox
            id="create-task-cycle"
            label="Цикл"
            checked={cycleEnabled}
            onCheckedChange={(v) => {
              setCycleEnabled(v);
              if (!v) setRecurringValues(defaultRecurringFieldValues());
            }}
            className="text-sm font-medium text-[var(--syt-text)]"
          />
          {cycleEnabled && (
            <RecurringRuleFields value={recurringValues} onChange={patchRecurring} />
          )}
        </div>
      )}

      {error && <p className="text-sm text-[var(--syt-error)]">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" className="rounded-xl py-2.5 w-full sm:w-auto" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            loading ||
            (allowRecurring && cycleEnabled && !recurringFieldsValid(recurringValues))
          }
          variant="primary"
          className="w-full sm:flex-1 rounded-xl py-2.5"
        >
          {loading ? 'Creating…' : 'Add task'}
        </Button>
      </div>
    </form>
  );
}
