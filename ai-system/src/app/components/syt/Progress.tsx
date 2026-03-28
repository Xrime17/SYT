import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Flame, TrendingUp, Target } from 'lucide-react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, size = 'md', variant = 'accent', showLabel = false, className }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    };

    const variants = {
      default: 'bg-syt-text-secondary',
      accent: 'bg-syt-accent',
      success: 'bg-syt-success',
      warning: 'bg-syt-warning',
      error: 'bg-syt-error',
    };

    return (
      <div ref={ref} className={cn('w-full', className)}>
        <div
          className={cn(
            'w-full rounded-full bg-syt-surface overflow-hidden',
            sizes[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <p className="text-xs text-syt-text-muted mt-1">
            {value} / {max}
          </p>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// Circular Progress
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'accent' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const CircularProgress = forwardRef<SVGSVGElement, CircularProgressProps>(
  (
    {
      value,
      max = 100,
      size = 64,
      strokeWidth = 6,
      variant = 'accent',
      showLabel = true,
      label,
      className,
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const variants = {
      accent: 'stroke-syt-accent',
      success: 'stroke-syt-success',
      warning: 'stroke-syt-warning',
      error: 'stroke-syt-error',
    };

    return (
      <div className={cn('relative inline-flex', className)}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-syt-surface"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className={cn('transition-all duration-300 ease-out', variants[variant])}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-semibold text-syt-text">{Math.round(percentage)}%</span>
            {label && <span className="text-xs text-syt-text-muted">{label}</span>}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

// Streak Indicator
export interface StreakIndicatorProps {
  days: number;
  variant?: 'default' | 'fire';
  className?: string;
}

export function StreakIndicator({ days, variant = 'fire', className }: StreakIndicatorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
        variant === 'fire'
          ? 'bg-gradient-to-r from-syt-warning-subtle to-syt-error-subtle'
          : 'bg-syt-surface border border-syt-border',
        className
      )}
    >
      {variant === 'fire' ? (
        <Flame className="w-5 h-5 text-syt-warning" />
      ) : (
        <TrendingUp className="w-5 h-5 text-syt-success" />
      )}
      <div className="flex flex-col">
        <span className="font-semibold text-syt-text leading-none">{days}</span>
        <span className="text-xs text-syt-text-muted">day streak</span>
      </div>
    </div>
  );
}

// Completion Stats Card
export interface CompletionStatsProps {
  completed: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export function CompletionStats({
  completed,
  total,
  label = 'Tasks Completed',
  showPercentage = true,
  className,
}: CompletionStatsProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn('bg-syt-card border border-syt-border rounded-xl p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-syt-accent" />
          <h4 className="font-medium text-syt-text">{label}</h4>
        </div>
        {showPercentage && (
          <span className="font-semibold text-syt-accent">{percentage}%</span>
        )}
      </div>
      <ProgressBar value={completed} max={total} size="lg" variant="accent" />
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-syt-text-muted">
          {completed} of {total} completed
        </span>
      </div>
    </div>
  );
}
