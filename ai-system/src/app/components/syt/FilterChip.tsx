import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onToggle?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterChip({ label, active = false, onToggle, onRemove, icon, className }: FilterChipProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-all duration-200',
        'border whitespace-nowrap',
        active
          ? 'bg-syt-accent text-white border-syt-accent'
          : 'bg-syt-surface text-syt-text-secondary border-syt-border hover:border-syt-accent/50',
        className
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{label}</span>
      {/* Use <span> instead of nested <button> to avoid invalid HTML nesting */}
      {active && onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="ml-0.5 -mr-1 p-0.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          aria-label="Remove filter"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  );
}

export interface FilterGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FilterGroup({ children, className }: FilterGroupProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto scrollbar-hide', className)}>
      {children}
    </div>
  );
}