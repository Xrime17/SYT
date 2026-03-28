'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/Checkbox';
import { PriorityBadge, type Priority } from '@/components/PriorityBadge';

/**
 * Карточка задачи на Home — как `ai-system/.../TaskCard.tsx`:
 * заголовок + время справа в первой строке; edit/delete в углу (hover / focus-within; на узких экранах всегда видны).
 * Нижний ряд: бейджи слева, колокольчик + чекбокс справа (delete только в верхнем оверлее).
 * Только `var(--syt-*)`.
 */
export interface HomeTaskCardProps {
  title: string;
  titleHref?: string;
  description?: string | null;
  /** Время в правом верхнем углу (например "14:00") */
  time?: string | null;
  priority: Priority;
  statusLabel: string;
  /** Показывается слева в нижнем ряду, если нет `time` (дата без времени) */
  dueDateChip?: string | null;
  completed: boolean;
  reminderEnabled?: boolean;
  /** Пока грузится список напоминаний с сервера — не дергать toggle */
  reminderToggleDisabled?: boolean;
  onToggleComplete?: () => void;
  onToggleReminder?: () => void;
  /** Редактирование (например `router.push('/tasks/' + id)`) */
  onEdit?: () => void;
  onDelete?: () => void;
  /** Доп. строка под карточкой (например «Due …») */
  footerLine?: string | null;
  className?: string;
}

export function HomeTaskCard({
  title,
  titleHref,
  description,
  time,
  priority,
  statusLabel,
  dueDateChip,
  completed,
  reminderEnabled = false,
  reminderToggleDisabled = false,
  onToggleComplete,
  onToggleReminder,
  onEdit,
  onDelete,
  footerLine,
  className = '',
}: HomeTaskCardProps) {
  const hasHoverActions = Boolean(onEdit || onDelete);

  const titleClass = `font-medium text-sm flex-1 min-w-0 text-[var(--syt-text)] ${
    completed ? 'line-through text-[var(--syt-text-muted)] opacity-80' : ''
  }`;

  const titleNode = titleHref ? (
    <Link href={titleHref} className={titleClass}>
      {title}
    </Link>
  ) : (
    <h3 className={titleClass}>{title}</h3>
  );

  return (
    <div
      className={`group relative rounded-[var(--syt-radius-card)] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 transition-colors duration-200 hover:border-[var(--syt-accent)]/30 ${
        completed ? 'opacity-60' : ''
      } ${className}`}
    >
      {hasHoverActions ? (
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-[var(--syt-border)] bg-[var(--syt-card)] p-0.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          role="toolbar"
          aria-label="Task actions"
        >
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-1.5 text-[var(--syt-text-muted)] transition-colors hover:bg-[var(--syt-surface)] hover:text-[var(--syt-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
              aria-label="Edit task"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          ) : null}
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-1.5 text-[var(--syt-text-muted)] transition-colors hover:bg-[var(--syt-error)]/15 hover:text-[var(--syt-error)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
              aria-label="Delete task"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className={`mb-2 flex items-start justify-between gap-3 ${hasHoverActions ? 'pr-14' : ''}`}
      >
        {titleNode}
        {time ? (
          <span className="shrink-0 tabular-nums text-sm font-normal text-[var(--syt-text-secondary)]">
            {time}
          </span>
        ) : null}
      </div>

      {description ? (
        <p className="mb-3 line-clamp-2 text-sm text-[var(--syt-text-secondary)]">{description}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <PriorityBadge priority={priority} className="rounded px-2 py-0.5 text-[10px]" />
          <span className="rounded bg-[var(--syt-surface)] px-2 py-0.5 text-[10px] text-[var(--syt-text-secondary)]">
            {statusLabel}
          </span>
          {dueDateChip && !time ? (
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

        <div className="flex shrink-0 items-center gap-2">
          {onToggleReminder ? (
            <button
              type="button"
              onClick={onToggleReminder}
              disabled={reminderToggleDisabled}
              aria-busy={reminderToggleDisabled || undefined}
              className={`rounded-lg p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] disabled:pointer-events-none disabled:opacity-40 ${
                reminderEnabled
                  ? 'text-[var(--syt-warning)] hover:bg-[var(--syt-warning)]/15'
                  : 'text-[var(--syt-text-muted)] hover:bg-[var(--syt-surface)] hover:text-[var(--syt-text)]'
              }`}
              aria-label={reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
            >
              {reminderEnabled ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              )}
            </button>
          ) : null}

          {onToggleComplete ? (
            <Checkbox
              checked={completed}
              onCheckedChange={() => onToggleComplete()}
              className="gap-0"
              aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
            />
          ) : null}
        </div>
      </div>

      {footerLine ? (
        <p className="mt-2 text-xs text-[var(--syt-text-muted)]">{footerLine}</p>
      ) : null}
    </div>
  );
}
