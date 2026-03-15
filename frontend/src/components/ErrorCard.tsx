'use client';

import React from 'react';
import { Button } from './Button';

export interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorCard({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}: ErrorCardProps) {
  return (
    <div
      className={`
        syt-glass-card border-[var(--syt-error)]/30 p-5 gap-4 flex flex-col
        ${className}
      `}
    >
      <p className="font-medium text-[var(--syt-error)]">{title}</p>
      <p className="text-sm text-[var(--syt-text-secondary)]">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
