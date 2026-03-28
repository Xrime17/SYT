import { cn } from '@/lib/utils';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'active' | 'done' | 'overdue';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap';

  const variants = {
    default: 'bg-syt-surface text-syt-text-secondary border border-syt-border',
    accent: 'bg-syt-accent-subtle text-syt-accent',
    success: 'bg-syt-success-subtle text-syt-success',
    warning: 'bg-syt-warning-subtle text-syt-warning',
    error: 'bg-syt-error-subtle text-syt-error',
  };

  const sizes = {
    sm: 'h-5 px-2 text-xs',
    md: 'h-6 px-2.5 text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

export interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const variantMap: Record<Priority, 'default' | 'warning' | 'error'> = {
    low: 'default',
    medium: 'warning',
    high: 'error',
  };

  const labelMap: Record<Priority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return (
    <Badge variant={variantMap[priority]} size="sm" className={className}>
      {labelMap[priority]}
    </Badge>
  );
}

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variantMap: Record<Status, 'accent' | 'success' | 'error'> = {
    active: 'accent',
    done: 'success',
    overdue: 'error',
  };

  const labelMap: Record<Status, string> = {
    active: 'Active',
    done: 'Done',
    overdue: 'Overdue',
  };

  return (
    <Badge variant={variantMap[status]} size="sm" className={className}>
      {labelMap[status]}
    </Badge>
  );
}

export interface FrequencyBadgeProps {
  frequency: Frequency;
  className?: string;
}

export function FrequencyBadge({ frequency, className }: FrequencyBadgeProps) {
  const labelMap: Record<Frequency, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    custom: 'Custom',
  };

  return (
    <Badge variant="default" size="sm" className={className}>
      {labelMap[frequency]}
    </Badge>
  );
}
