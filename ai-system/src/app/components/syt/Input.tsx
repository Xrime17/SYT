import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-syt-text mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-syt-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-10 px-3 bg-syt-surface border border-syt-border rounded-lg text-syt-text placeholder:text-syt-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-syt-accent focus:border-transparent',
              'transition-all duration-200',
              error && 'border-syt-error focus:ring-syt-error',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-syt-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-syt-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-syt-text mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full min-h-[80px] p-3 bg-syt-surface border border-syt-border rounded-lg text-syt-text placeholder:text-syt-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-syt-accent focus:border-transparent',
            'transition-all duration-200 resize-none',
            error && 'border-syt-error focus:ring-syt-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-syt-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-syt-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
