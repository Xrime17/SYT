import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Flag, MoreVertical, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { PriorityBadge, StatusBadge, type Priority, type Status } from './Badge';
import { DragHandle } from './DragHandle';

export interface TaskListItemProps {
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: string;
  tags?: string[];
  completed?: boolean;
  draggable?: boolean;
  expandable?: boolean;
  defaultExpanded?: boolean;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

// Compact Task Item
export function TaskListItem({
  title,
  description,
  priority,
  status,
  dueDate,
  tags,
  completed = false,
  draggable = false,
  expandable = false,
  defaultExpanded = false,
  onToggleComplete,
  onEdit,
  onDelete,
  className,
}: TaskListItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const canExpand = expandable && (description || tags);

  return (
    <div
      className={cn(
        'group bg-syt-card border border-syt-border rounded-lg',
        'hover:border-syt-accent/30 transition-all duration-200',
        completed && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Drag Handle */}
        {draggable && (
          <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <DragHandle size="sm" />
          </div>
        )}

        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox checked={completed} onChange={onToggleComplete} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h4
              className={cn(
                'font-medium text-sm text-syt-text flex-1',
                completed && 'line-through text-syt-text-muted'
              )}
            >
              {title}
            </h4>

            {/* Priority Badge */}
            {priority && !completed && <PriorityBadge priority={priority} />}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {dueDate && (
              <div className="flex items-center gap-1 text-xs text-syt-text-muted">
                <Calendar className="w-3 h-3" />
                <span>{dueDate}</span>
              </div>
            )}
            {status && <StatusBadge status={status} />}
          </div>

          {/* Expanded Content */}
          {canExpand && expanded && (
            <div className="mt-2 pt-2 border-t border-syt-divider-subtle">
              {description && (
                <p className="text-sm text-syt-text-secondary mb-2">{description}</p>
              )}
              {tags && tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-syt-surface text-syt-text-muted rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {canExpand && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded transition-colors"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            className="p-1 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded transition-colors opacity-0 group-hover:opacity-100"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
