import { Check, MoreVertical, Trash2, Edit3, Calendar, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge, StatusBadge, type Priority, type Status } from './Badge';
import { Checkbox } from './Checkbox';

export interface TaskCardProps {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: string;
  time?: string;
  completed?: boolean;
  reminderEnabled?: boolean;
  onToggleComplete?: () => void;
  onToggleReminder?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function TaskCard({
  title,
  description,
  priority,
  status,
  dueDate,
  time,
  completed = false,
  reminderEnabled = false,
  onToggleComplete,
  onToggleReminder,
  onEdit,
  onDelete,
  className,
}: TaskCardProps) {
  return (
    <div
      className={cn(
        'group relative bg-syt-card border border-syt-border rounded-xl p-4 touch-manipulation',
        'hover:border-syt-accent/30 active:bg-syt-surface/50 transition-all duration-200',
        completed && 'opacity-60',
        className
      )}
    >
      {/* Title row with bell + time */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className={cn(
          'font-medium text-syt-text flex-1 leading-snug',
          completed && 'line-through text-syt-text-muted'
        )}>
          {title}
        </h3>
        {/* Bell and time on the same line */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleReminder && (
            <button
              onClick={onToggleReminder}
              className={cn(
                'p-1.5 rounded-lg transition-colors touch-manipulation',
                reminderEnabled
                  ? 'text-syt-warning hover:bg-syt-warning-subtle active:scale-95'
                  : 'text-syt-text-muted hover:text-syt-text hover:bg-syt-surface active:scale-95'
              )}
              aria-label={reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
            >
              {reminderEnabled ? (
                <Bell className="w-5 h-5" fill="currentColor" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </button>
          )}
          {time && (
            <span className="text-sm text-syt-text-secondary font-normal">
              {time}
            </span>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm text-syt-text-secondary mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Bottom row: badges + checkbox */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: badges */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {priority && <PriorityBadge priority={priority} />}
          {status && <StatusBadge status={status} />}
          {dueDate && !time && (
            <div className="flex items-center gap-1 text-xs text-syt-text-muted">
              <Calendar className="w-3 h-3" />
              <span>{dueDate}</span>
            </div>
          )}
        </div>

        {/* Right: checkbox only */}
        <div className="flex items-center shrink-0">
          <Checkbox
            checked={completed}
            onChange={onToggleComplete}
            className="w-6 h-6"
          />
        </div>
      </div>

      {/* Hover actions (edit/delete) - hidden on mobile, shown on hover on desktop */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-syt-text-muted hover:text-syt-accent hover:bg-syt-surface rounded-lg transition-colors"
              aria-label="Edit task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-syt-text-muted hover:text-syt-error hover:bg-syt-error-subtle rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export interface RecurringCardProps {
  title: string;
  description?: string;
  frequency: string;
  nextDue?: string;
  completed?: boolean;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function RecurringCard({
  title,
  description,
  frequency,
  nextDue,
  completed = false,
  onToggleComplete,
  onEdit,
  className,
}: RecurringCardProps) {
  return (
    <div
      className={cn(
        'group relative bg-syt-card border border-syt-border rounded-xl p-4',
        'hover:border-syt-accent/30 transition-all duration-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox checked={completed} onChange={onToggleComplete} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-syt-text mb-1">{title}</h3>
          {description && (
            <p className="text-sm text-syt-text-secondary mb-2">{description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-syt-accent-subtle text-syt-accent rounded-full">
              {frequency}
            </span>
            {nextDue && (
              <span className="text-xs text-syt-text-muted">Next: {nextDue}</span>
            )}
          </div>
        </div>

        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 text-syt-text-muted hover:text-syt-accent hover:bg-syt-surface rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Edit recurring task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}