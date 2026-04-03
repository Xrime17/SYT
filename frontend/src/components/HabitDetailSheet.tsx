'use client';

import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import {
  decrementHabit,
  HABIT_ICON_KEYS,
  type HabitIconKey,
  type HabitListItem,
  updateHabit,
} from '@/api/habits';
import { HabitCircleIcon } from '@/components/HabitCircleIcon';

export type HabitDetailSheetProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  habit: HabitListItem | null;
};

export function HabitDetailSheet({ open, onClose, userId, habit }: HabitDetailSheetProps) {
  const [title, setTitle] = useState('');
  const [iconKey, setIconKey] = useState<HabitIconKey>('water');
  const [targetPerDay, setTargetPerDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!habit) return;
    setTitle(habit.title);
    setIconKey((HABIT_ICON_KEYS as readonly string[]).includes(habit.iconKey) ? (habit.iconKey as HabitIconKey) : 'water');
    setTargetPerDay(habit.targetPerDay);
    setError(null);
  }, [habit]);

  const revalidate = useCallback(async () => {
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
  }, [userId]);

  const handleDecrement = useCallback(async () => {
    if (!habit) return;
    setError(null);
    setLoading(true);
    try {
      await decrementHabit(habit.id, userId);
      await revalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }, [habit, userId, revalidate]);

  const handleSave = useCallback(async () => {
    if (!habit || !title.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await updateHabit(habit.id, {
        userId,
        title: title.trim(),
        iconKey,
        targetPerDay: Math.min(99, Math.max(1, targetPerDay)),
      });
      await revalidate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }, [habit, userId, title, iconKey, targetPerDay, revalidate, onClose]);

  const handleArchive = useCallback(async () => {
    if (!habit) return;
    setError(null);
    setLoading(true);
    try {
      await updateHabit(habit.id, { userId, archived: true });
      await revalidate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  }, [habit, userId, revalidate, onClose]);

  if (!habit) return null;

  return (
    <BottomSheet open={open} onClose={onClose} title="Habit">
      <div className="flex flex-col gap-6">
        <div className="rounded-[12px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--syt-text-muted)]">Today</p>
          <p className="text-lg font-semibold text-[var(--syt-text)]">
            {habit.todayCount} / {habit.targetPerDay}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              disabled={loading || habit.todayCount <= 0}
              onClick={() => void handleDecrement()}
            >
              −1 today
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--syt-text)]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
          />
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
                    : 'border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-muted)]'
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
          <label htmlFor="habit-edit-target" className="text-sm font-medium text-[var(--syt-text)]">
            Target per day
          </label>
          <input
            id="habit-edit-target"
            type="number"
            min={1}
            max={99}
            value={targetPerDay}
            onChange={(e) => setTargetPerDay(parseInt(e.target.value, 10) || 1)}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
          />
        </div>

        {error && <p className="text-sm text-[var(--syt-error)]">{error}</p>}

        <div className="flex flex-col gap-3">
          <Button type="button" className="rounded-xl w-full" disabled={loading || !title.trim()} onClick={() => void handleSave()}>
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl w-full border-[var(--syt-error)]/40 text-[var(--syt-error)] hover:bg-[var(--syt-error)]/10"
            disabled={loading}
            onClick={() => void handleArchive()}
          >
            Archive
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
