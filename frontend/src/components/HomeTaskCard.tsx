'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/Checkbox';
import { PriorityBadge, type Priority } from '@/components/PriorityBadge';

const REVEAL_PX = 128;

/**
 * Карточка задачи на Home: заголовок + чекбокс справа; бейджи снизу слева; колокольчик и время;
 * свайп влево — Delete / Cancel. Только `var(--syt-*)`.
 */
export interface HomeTaskCardProps {
  title: string;
  titleHref?: string;
  description?: string | null;
  reminderActive: boolean;
  /** Время рядом с колокольчиком (например из напоминания или due). */
  reminderTime?: string | null;
  reminderToggleDisabled?: boolean;
  /** Активный: выключить напоминание; неактивный: открыть выбор даты/времени (родитель). */
  onReminderPress: () => void;
  priority: Priority;
  statusLabel: string;
  dueDateChip?: string | null;
  completed: boolean;
  onToggleComplete?: () => void;
  onDelete?: () => void;
  footerLine?: string | null;
  className?: string;
}

export function HomeTaskCard({
  title,
  titleHref,
  description,
  reminderActive,
  reminderTime,
  reminderToggleDisabled = false,
  onReminderPress,
  priority,
  statusLabel,
  dueDateChip,
  completed,
  onToggleComplete,
  onDelete,
  footerLine,
  className = '',
}: HomeTaskCardProps) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{ start: number; startOff: number } | null>(null);

  const close = useCallback(() => setOffset(0), []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!onDelete) return;
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture?.(e.pointerId);
      setIsDragging(true);
      drag.current = { start: e.clientX, startOff: offset };
    },
    [onDelete, offset]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!onDelete || !drag.current) return;
      const dx = e.clientX - drag.current.start;
      let next = drag.current.startOff + dx;
      if (next > 0) next = 0;
      if (next < -REVEAL_PX) next = -REVEAL_PX;
      setOffset(next);
    },
    [onDelete]
  );

  const onPointerUp = useCallback(() => {
    if (!onDelete) {
      return;
    }
    setIsDragging(false);
    if (drag.current) {
      drag.current = null;
      setOffset((o) => (o < -REVEAL_PX / 2 ? -REVEAL_PX : 0));
    }
  }, [onDelete]);

  const titleClass = `font-medium text-sm flex-1 min-w-0 text-[var(--syt-text)] ${
    completed ? 'line-through text-[var(--syt-text-muted)] opacity-80' : ''
  }`;

  const titleNode = titleHref ? (
    <Link href={titleHref} className={titleClass} onClick={(e) => offset !== 0 && e.preventDefault()}>
      {title}
    </Link>
  ) : (
    <h3 className={titleClass}>{title}</h3>
  );

  const cardInner = (
    <div
      className={`rounded-[var(--syt-radius-card)] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 transition-[border-color] duration-200 hover:border-[var(--syt-accent)]/30 ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">{titleNode}</div>
        {onToggleComplete ? (
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggleComplete()}
            className="gap-0 shrink-0"
            aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          />
        ) : null}
      </div>

      {description ? (
        <p className="mb-3 line-clamp-2 text-sm text-[var(--syt-text-secondary)]">{description}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <PriorityBadge priority={priority} className="rounded px-2 py-0.5 text-[10px]" />
          <span
            className={`rounded px-2 py-0.5 text-[10px] ${
              completed && statusLabel === 'Done'
                ? 'bg-[var(--syt-success)]/15 text-[var(--syt-success)]'
                : 'bg-[var(--syt-surface)] text-[var(--syt-text-secondary)]'
            }`}
          >
            {statusLabel}
          </span>
          {dueDateChip && !reminderTime ? (
            <div className="flex items-center gap-1 text-xs text-[var(--syt-text-muted)]">
              <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{dueDateChip}</span>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onReminderPress}
          disabled={reminderToggleDisabled}
          aria-busy={reminderToggleDisabled || undefined}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] disabled:pointer-events-none disabled:opacity-40 ${
            reminderActive
              ? 'text-[var(--syt-warning)] hover:bg-[var(--syt-warning)]/15'
              : 'text-[var(--syt-text-muted)] hover:bg-[var(--syt-surface)]'
          }`}
          aria-label={reminderActive ? 'Reminder on' : 'Set reminder'}
        >
          {reminderActive ? (
            <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
            </svg>
          )}
          {reminderTime ? (
            <span
              className={`tabular-nums text-sm ${
                reminderActive ? 'text-[var(--syt-text-secondary)]' : 'text-[var(--syt-text-muted)] line-through'
              }`}
            >
              {reminderTime}
            </span>
          ) : null}
        </button>
      </div>

      {footerLine ? (
        <p className="mt-2 text-xs text-[var(--syt-text-muted)]">{footerLine}</p>
      ) : null}
    </div>
  );

  if (!onDelete) {
    return <div className={className}>{cardInner}</div>;
  }

  return (
    <div className={`relative overflow-hidden rounded-[var(--syt-radius-card)] ${className}`}>
      <div
        className="absolute inset-y-0 right-0 z-0 flex w-[128px] items-stretch"
        aria-hidden={offset === 0}
      >
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-[var(--syt-surface)] text-xs font-medium text-[var(--syt-text-secondary)] hover:bg-[var(--syt-card)]"
          onClick={close}
        >
          Cancel
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-[var(--syt-error)] text-xs font-medium text-white hover:opacity-90"
          onClick={() => {
            close();
            onDelete();
          }}
        >
          Delete
        </button>
      </div>
      <div
        role="presentation"
        className="relative z-[1] touch-pan-y"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {cardInner}
      </div>
    </div>
  );
}
