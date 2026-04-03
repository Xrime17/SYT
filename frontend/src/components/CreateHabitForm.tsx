'use client';

import { useCallback, useState } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/Button';
import {
  createHabit,
  HABIT_ICON_KEYS,
  type HabitIconKey,
  type HabitListItem,
} from '@/api/habits';
import { HabitCircleIcon } from '@/components/HabitCircleIcon';

export type CreateHabitFormProps = {
  userId: string;
  onSuccess?: (h: HabitListItem) => void;
  onCancel?: () => void;
};

export function CreateHabitForm({ userId, onSuccess, onCancel }: CreateHabitFormProps) {
  const [title, setTitle] = useState('');
  const [iconKey, setIconKey] = useState<HabitIconKey>('water');
  const [targetPerDay, setTargetPerDay] = useState(1);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleError = touched && !title.trim() ? 'Title is required' : null;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setTouched(true);
      if (!title.trim()) return;
      setError(null);
      setLoading(true);
      try {
        const h = await createHabit({
          userId,
          title: title.trim(),
          iconKey,
          targetPerDay: Math.min(99, Math.max(1, targetPerDay)),
        });
        await mutate(
          (key) => Array.isArray(key) && key[0] === 'habits' && key[1] === userId,
          undefined,
          { revalidate: true }
        );
        await mutate(
          (key) => Array.isArray(key) && key[0] === 'homeMetrics' && key[1] === userId,
          undefined,
          { revalidate: true }
        );
        onSuccess?.(h);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    },
    [userId, title, iconKey, targetPerDay, onSuccess]
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
          placeholder="Habit name"
          className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
        />
        {titleError && <p className="text-xs text-[var(--syt-error)]">{titleError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--syt-text)]">Icon</span>
        <div className="flex flex-wrap gap-2">
          {HABIT_ICON_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setIconKey(k)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                iconKey === k
                  ? 'border-[var(--syt-accent)] bg-[var(--syt-accent)]/20 text-[var(--syt-accent)]'
                  : 'border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-muted)] hover:border-[var(--syt-accent)]/50'
              }`}
              aria-label={`Icon ${k}`}
              aria-pressed={iconKey === k}
            >
              <HabitCircleIcon iconKey={k} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="habit-target" className="text-sm font-medium text-[var(--syt-text)]">
          Target per day
        </label>
        <input
          id="habit-target"
          type="number"
          min={1}
          max={99}
          value={targetPerDay}
          onChange={(e) => setTargetPerDay(parseInt(e.target.value, 10) || 1)}
          className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
        />
      </div>

      {error && <p className="text-sm text-[var(--syt-error)]">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" className="rounded-xl w-full sm:w-auto" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="rounded-xl w-full sm:w-auto" disabled={loading}>
          {loading ? 'Saving…' : 'Create habit'}
        </Button>
      </div>
    </form>
  );
}
