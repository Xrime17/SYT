import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

export interface DragHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DragHandle = forwardRef<HTMLDivElement, DragHandleProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center cursor-grab active:cursor-grabbing',
          'text-syt-text-muted hover:text-syt-text transition-colors',
          className
        )}
        {...props}
      >
        <GripVertical className={sizes[size]} />
      </div>
    );
  }
);

DragHandle.displayName = 'DragHandle';
