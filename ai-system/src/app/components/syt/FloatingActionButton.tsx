import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  extended?: boolean;
  className?: string;
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FABProps>(
  (
    {
      icon,
      label,
      position = 'bottom-right',
      size = 'md',
      extended = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const positions = {
      'bottom-right': 'fixed bottom-20 right-4',
      'bottom-left': 'fixed bottom-20 left-4',
      'bottom-center': 'fixed bottom-20 left-1/2 -translate-x-1/2',
    };

    const sizes = {
      sm: extended ? 'h-10 px-4 gap-2' : 'w-12 h-12',
      md: extended ? 'h-14 px-6 gap-2' : 'w-14 h-14',
      lg: extended ? 'h-16 px-8 gap-3' : 'w-16 h-16',
    };

    const iconSizes = {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'bg-syt-accent text-white font-medium',
          'rounded-full shadow-lg',
          'hover:shadow-[0_8px_32px_var(--syt-accent-glow)]',
          'active:scale-95',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syt-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-syt-background',
          'z-50',
          positions[position],
          sizes[size],
          className
        )}
        disabled={disabled}
        {...props}
      >
        <span className={cn('flex items-center', iconSizes[size])}>{icon}</span>
        {extended && label && <span>{label}</span>}
      </button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

// Alias
export const FAB = FloatingActionButton;
