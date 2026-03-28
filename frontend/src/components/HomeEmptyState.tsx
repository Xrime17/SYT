'use client';

import { Button } from '@/components/Button';

export interface HomeEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

/**
 * Пустое состояние списка на Home — структура как `ai-system/.../EmptyState.tsx`, только `var(--syt-*)`.
 */
export function HomeEmptyState({
  icon,
  title,
  description,
  primaryAction,
  className = '',
}: HomeEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {icon ? (
        <div className="mb-4 text-[var(--syt-text-muted)] opacity-50 [&_svg]:h-12 [&_svg]:w-12">
          {icon}
        </div>
      ) : null}

      <h3 className="text-lg font-medium text-[var(--syt-text)] mb-2">{title}</h3>

      {description ? (
        <p className="text-sm text-[var(--syt-text-secondary)] mb-6 max-w-sm">{description}</p>
      ) : null}

      {primaryAction ? (
        <Button variant="primary" className="rounded-xl" onClick={primaryAction.onClick}>
          {primaryAction.icon ? (
            <span className="inline-flex items-center gap-2">
              {primaryAction.icon}
              {primaryAction.label}
            </span>
          ) : (
            primaryAction.label
          )}
        </Button>
      ) : null}
    </div>
  );
}
