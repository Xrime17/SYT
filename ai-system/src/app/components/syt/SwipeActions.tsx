import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { cn } from '@/lib/utils';
import { Check, Trash2 } from 'lucide-react';

export interface SwipeAction {
  icon: ReactNode;
  label: string;
  color: string;
  background: string;
  onAction: () => void;
}

export interface SwipeActionsProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
  className?: string;
}

export function SwipeActions({
  children,
  leftActions,
  rightActions,
  threshold = 80,
  className,
}: SwipeActionsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const leftActionWidth = leftActions ? leftActions.length * 80 : 0;
  const rightActionWidth = rightActions ? rightActions.length * 80 : 0;

  const handleDragEnd = (_event: any, info: PanInfo) => {
    setIsDragging(false);

    // Left swipe (show right actions)
    if (info.offset.x < -threshold && rightActions && rightActions.length > 0) {
      const actionIndex = Math.min(
        Math.floor(Math.abs(info.offset.x) / 80),
        rightActions.length - 1
      );
      rightActions[actionIndex]?.onAction();
      x.set(0);
    }
    // Right swipe (show left actions)
    else if (info.offset.x > threshold && leftActions && leftActions.length > 0) {
      const actionIndex = Math.min(
        Math.floor(info.offset.x / 80),
        leftActions.length - 1
      );
      leftActions[actionIndex]?.onAction();
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const leftOpacity = useTransform(x, [0, leftActionWidth], [0, 1]);
  const rightOpacity = useTransform(x, [-rightActionWidth, 0], [1, 0]);

  return (
    <div ref={constraintsRef} className={cn('relative overflow-hidden', className)}>
      {/* Left Actions */}
      {leftActions && leftActions.length > 0 && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 flex items-center"
          style={{ opacity: leftOpacity }}
        >
          {leftActions.map((action, index) => (
            <div
              key={index}
              className="h-full w-20 flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: action.background }}
            >
              <span style={{ color: action.color }}>{action.icon}</span>
              <span className="text-xs" style={{ color: action.color }}>
                {action.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Right Actions */}
      {rightActions && rightActions.length > 0 && (
        <motion.div
          className="absolute right-0 top-0 bottom-0 flex items-center"
          style={{ opacity: rightOpacity }}
        >
          {rightActions.map((action, index) => (
            <div
              key={index}
              className="h-full w-20 flex flex-col items-center justify-center gap-1"
              style={{ backgroundColor: action.background }}
            >
              <span style={{ color: action.color }}>{action.icon}</span>
              <span className="text-xs" style={{ color: action.color }}>
                {action.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Swipeable Content */}
      <motion.div
        drag="x"
        dragConstraints={{
          left: rightActions ? -rightActionWidth : 0,
          right: leftActions ? leftActionWidth : 0,
        }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn('relative bg-syt-background', isDragging && 'cursor-grabbing')}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Quick preset for task swipe actions
export interface TaskSwipeActionsProps {
  children: ReactNode;
  onComplete?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function TaskSwipeActions({
  children,
  onComplete,
  onDelete,
  className,
}: TaskSwipeActionsProps) {
  const leftActions: SwipeAction[] = onComplete
    ? [
        {
          icon: <Check className="w-5 h-5" />,
          label: 'Done',
          color: '#10B981',
          background: 'rgba(16, 185, 129, 0.12)',
          onAction: onComplete,
        },
      ]
    : [];

  const rightActions: SwipeAction[] = onDelete
    ? [
        {
          icon: <Trash2 className="w-5 h-5" />,
          label: 'Delete',
          color: '#EF4444',
          background: 'rgba(239, 68, 68, 0.12)',
          onAction: onDelete,
        },
      ]
    : [];

  return (
    <SwipeActions
      leftActions={leftActions}
      rightActions={rightActions}
      className={className}
    >
      {children}
    </SwipeActions>
  );
}
