import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SegmentItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  items: SegmentItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl({
  items,
  value,
  onValueChange,
  size = 'md',
  fullWidth = false,
  className,
}: SegmentedControlProps) {
  const [selectedValue, setSelectedValue] = useState(value || items[0]?.value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  const sizes = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-1 p-1',
        'bg-syt-surface border border-syt-border rounded-lg',
        fullWidth && 'w-full',
        className
      )}
    >
      {/* Background indicator */}
      <div
        className="absolute top-1 bottom-1 bg-syt-card border border-syt-border rounded-md transition-all duration-200 ease-out shadow-sm"
        style={{
          left: `calc(${(selectedIndex / items.length) * 100}% + 0.25rem)`,
          width: `calc(${100 / items.length}% - 0.5rem)`,
        }}
      />

      {/* Segments */}
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => handleChange(item.value)}
          className={cn(
            'relative z-10 inline-flex items-center justify-center gap-2 px-4',
            'font-medium transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syt-focus-ring rounded-md',
            sizes[size],
            fullWidth && 'flex-1',
            selectedValue === item.value
              ? 'text-syt-text'
              : 'text-syt-text-secondary hover:text-syt-text'
          )}
        >
          {item.icon && <span className="flex items-center">{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
}
