import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CategoryChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export const CategoryChip = forwardRef<HTMLButtonElement, CategoryChipProps>(
  ({ label, selected = false, icon, color, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          'w-12 h-12 rounded-full',
          'font-medium text-sm',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syt-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-syt-background',
          selected
            ? 'bg-syt-accent text-white ring-2 ring-syt-accent ring-offset-2 ring-offset-syt-background'
            : 'bg-syt-card text-syt-text-secondary border border-syt-border hover:border-syt-accent/50 hover:text-syt-text',
          className
        )}
        {...props}
      >
        {icon || label.slice(0, 2).toUpperCase()}
      </button>
    );
  }
);

CategoryChip.displayName = 'CategoryChip';

export interface CategoryChipStripProps {
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    color?: string;
  }>;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onAdd?: () => void;
  className?: string;
}

export function CategoryChipStrip({
  items,
  selectedId,
  onSelect,
  onAdd,
  className,
}: CategoryChipStripProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto scrollbar-hide py-2',
        className
      )}
    >
      {items.map((item) => (
        <CategoryChip
          key={item.id}
          label={item.label}
          icon={item.icon}
          color={item.color}
          selected={item.id === selectedId}
          onClick={() => onSelect?.(item.id)}
        />
      ))}
      {onAdd && (
        <button
          onClick={onAdd}
          className={cn(
            'flex items-center justify-center shrink-0',
            'w-12 h-12 rounded-full',
            'bg-syt-surface border border-dashed border-syt-border',
            'text-syt-text-muted hover:text-syt-accent hover:border-syt-accent',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syt-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-syt-background'
          )}
          aria-label="Add category"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
