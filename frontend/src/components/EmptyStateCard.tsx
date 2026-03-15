'use client';

import React from 'react';
import { Button } from './Button';

export interface EmptyStateCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyStateCard({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateCardProps) {
  return (
    <div
      className={`
        syt-glass-card flex flex-col items-center justify-center text-center
        p-8 min-h-[200px] gap-4
        ${className}
      `}
    >
      {icon && <div className="text-5xl opacity-80">{icon}</div>}
      <p className="text-[var(--syt-text)] font-medium">{title}</p>
      {description && (
        <p className="text-sm text-[var(--syt-text-secondary)] max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
