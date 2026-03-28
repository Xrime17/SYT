'use client';

import { useCallback, useRef } from 'react';
import type { HomeCategory } from '@/api/home-categories';

export type HomeCategoryFilterChipProps = {
  category: HomeCategory;
  selected: boolean;
  onSelect: () => void;
  onEdit: (c: HomeCategory) => void;
};

export function HomeCategoryFilterChip({
  category,
  selected,
  onSelect,
  onEdit,
}: HomeCategoryFilterChipProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback(() => {
    clearTimer();
    longPressFired.current = false;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      longPressFired.current = true;
      onEdit(category);
    }, 550);
  }, [category, onEdit, clearTimer]);

  const chip = category.emoji || category.shortLabel;

  return (
    <button
      type="button"
      onClick={() => {
        if (longPressFired.current) {
          longPressFired.current = false;
          return;
        }
        onSelect();
      }}
      onTouchStart={startLongPress}
      onTouchEnd={clearTimer}
      onTouchCancel={clearTimer}
      onTouchMove={clearTimer}
      onContextMenu={(e) => {
        e.preventDefault();
        onEdit(category);
      }}
      className={`flex h-12 min-w-12 shrink-0 items-center justify-center rounded-full px-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--syt-background)] ${
        selected
          ? 'bg-[var(--syt-accent)] text-white ring-2 ring-[var(--syt-accent)] ring-offset-2 ring-offset-[var(--syt-background)]'
          : 'bg-[var(--syt-card)] text-[var(--syt-text-secondary)] border border-[var(--syt-border)] hover:border-[var(--syt-accent)]/50 hover:text-[var(--syt-text)]'
      }`}
      aria-pressed={selected}
      aria-label={`${category.label}. Long-press or right-click to edit`}
      title={`${category.label} · hold to edit`}
    >
      {chip}
    </button>
  );
}
