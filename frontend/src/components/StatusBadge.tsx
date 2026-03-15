'use client';

import React from 'react';

export type TaskStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

const styles: Record<TaskStatus, string> = {
  ACTIVE: 'bg-[var(--syt-accent)]/15 text-[var(--syt-accent-glow)] border-[var(--syt-accent)]/30',
  COMPLETED: 'bg-[var(--syt-success)]/15 text-[var(--syt-success)] border-[var(--syt-success)]/30',
  ARCHIVED: 'bg-[var(--syt-text-muted)]/20 text-[var(--syt-text-muted)] border-[var(--syt-border)]',
};

export interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
        ${styles[status]}
        ${className}
      `}
    >
      {status}
    </span>
  );
}
