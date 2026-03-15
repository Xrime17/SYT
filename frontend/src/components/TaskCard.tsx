'use client';

import React from 'react';
import { Checkbox } from './Checkbox';
import { PriorityBadge, type Priority } from './PriorityBadge';
import { StatusBadge, type TaskStatus } from './StatusBadge';

export interface TaskCardProps {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: Priority;
  dueDate?: string | null;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function TaskCard({
  title,
  description,
  status,
  priority,
  dueDate,
  completed = false,
  onToggle,
  onDelete,
  className = '',
}: TaskCardProps) {
  return (
    <div
      className={`
        syt-glass-card p-4 flex items-start gap-3 group transition-all duration-200
        hover:border-[var(--syt-glass-border)]
        ${className}
      `}
    >
      <div className="pt-0.5 shrink-0">
        {onToggle && (
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggle?.()}
            aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`
            font-medium text-[var(--syt-text)] truncate
            ${completed ? 'line-through text-[var(--syt-text-muted)]' : ''}
          `}
        >
          {title}
        </p>
        {description && (
          <p className="text-sm text-[var(--syt-text-secondary)] mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <StatusBadge status={status} />
          {priority && <PriorityBadge priority={priority} />}
          {dueDate && (
            <span className="text-xs text-[var(--syt-text-muted)]">
              {new Date(dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 p-2 rounded-lg text-[var(--syt-text-muted)] hover:bg-[var(--syt-error)]/10 hover:text-[var(--syt-error)] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}
