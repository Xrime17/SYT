import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'subtle' | 'default' | 'strong';
  label?: string;
  className?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', variant = 'default', label, className }, ref) => {
    const variants = {
      subtle: 'bg-syt-divider-subtle',
      default: 'bg-syt-divider',
      strong: 'bg-syt-divider-strong',
    };

    if (label && orientation === 'horizontal') {
      return (
        <div ref={ref} className={cn('flex items-center gap-3', className)}>
          <div className={cn('flex-1 h-px', variants[variant])} />
          <span className="text-xs text-syt-text-muted font-medium">{label}</span>
          <div className={cn('flex-1 h-px', variants[variant])} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
          className
        )}
        role="separator"
        aria-orientation={orientation}
      />
    );
  }
);

Divider.displayName = 'Divider';
