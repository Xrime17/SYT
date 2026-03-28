import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, description, children, onClose, className }, ref) => {
    const Icon = icons[variant];

    const variants = {
      info: 'bg-syt-accent-subtle border-syt-accent/20 text-syt-accent',
      success: 'bg-syt-success-subtle border-syt-success/20 text-syt-success',
      warning: 'bg-syt-warning-subtle border-syt-warning/20 text-syt-warning',
      error: 'bg-syt-error-subtle border-syt-error/20 text-syt-error',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 p-4 rounded-xl border',
          variants[variant],
          className
        )}
        role="alert"
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium text-syt-text mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm text-syt-text-secondary">{description}</p>
          )}
          {children && (
            <div className="mt-2 text-sm text-syt-text-secondary">{children}</div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded-md transition-colors flex-shrink-0"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
