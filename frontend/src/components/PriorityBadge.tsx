'use client';

import React from 'react';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

const styles: Record<Priority, string> = {
  LOW: 'bg-[var(--syt-surface)] text-[var(--syt-text-secondary)] border-[var(--syt-border)]',
  MEDIUM: 'bg-[var(--syt-warning)]/15 text-[var(--syt-warning)] border-[var(--syt-warning)]/30',
  HIGH: 'bg-[var(--syt-error)]/15 text-[var(--syt-error)] border-[var(--syt-error)]/30',
};

export interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
        ${styles[priority]}
        ${className}
      `}
    >
      {priority}
    </span>
  );
}
