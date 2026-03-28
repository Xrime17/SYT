import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const variants = {
      primary: 'bg-syt-accent text-white hover:shadow-[0_0_20px_var(--syt-accent-glow)] active:bg-[#5558E3]',
      secondary: 'bg-syt-surface text-syt-text border border-syt-border hover:bg-syt-card active:bg-[#0F0F11]',
      ghost: 'text-syt-text-secondary hover:bg-syt-surface active:bg-syt-card',
      destructive: 'bg-syt-error text-white hover:shadow-[0_0_20px_var(--syt-error-subtle)] active:bg-[#DC2626]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
