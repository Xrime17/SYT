'use client';

import { useRef } from 'react';
import type { HabitListItem } from '@/api/habits';
import { HabitCircleIcon } from '@/components/HabitCircleIcon';

const LONG_PRESS_MS = 500;

export function HabitTapCircle({
  habit,
  onTap,
  onLongPress,
}: {
  habit: HabitListItem;
  onTap: () => void;
  onLongPress: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const onPointerDown = () => {
    longPressFired.current = false;
    timerRef.current = setTimeout(() => {
      longPressFired.current = true;
      timerRef.current = null;
      onLongPress();
    }, LONG_PRESS_MS);
  };

  const onPointerEnd = () => {
    if (timerRef.current) {
      clearTimer();
      if (!longPressFired.current) onTap();
    }
  };

  const { todayCount, targetPerDay, doneToday } = habit;
  const inProgress = !doneToday && todayCount > 0;

  const ringClass = doneToday
    ? 'border-2 border-[var(--syt-accent)] bg-[var(--syt-accent)]/20 text-[var(--syt-accent)]'
    : inProgress
      ? 'border-2 border-[var(--syt-accent)]/60 bg-[var(--syt-card)] text-[var(--syt-accent)]'
      : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-muted)]';

  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerLeave={onPointerEnd}
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-colors touch-manipulation ${ringClass}`}
      aria-label={`${habit.title}, ${todayCount} of ${targetPerDay} today`}
      title={habit.title}
    >
      <HabitCircleIcon iconKey={habit.iconKey} />
    </button>
  );
}
