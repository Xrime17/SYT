import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, readOnly, ...props }, ref) => {
    // Provide a no-op onChange when the component is used in display-only mode
    // (controlled `checked` without `onChange`) to suppress the React warning.
    const handleChange = onChange ?? (() => {});
    const isReadOnly = readOnly ?? (!onChange && checked !== undefined);

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 border-2 rounded-md transition-all duration-200',
              'peer-checked:bg-syt-accent peer-checked:border-syt-accent',
              'peer-focus:ring-2 peer-focus:ring-syt-accent peer-focus:ring-offset-2 peer-focus:ring-offset-syt-background',
              'group-hover:border-syt-accent/50',
              !checked && 'border-syt-border bg-syt-surface',
              className
            )}
          >
            {checked && (
              <Check className="w-4 h-4 text-white absolute inset-0 m-auto" strokeWidth={3} />
            )}
          </div>
        </div>
        {label && (
          <span className="text-syt-text select-none">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, checked, onChange, readOnly, ...props }, ref) => {
    const handleChange = onChange ?? (() => {});
    const isReadOnly = readOnly ?? (!onChange && checked !== undefined);

    return (
      <label className="inline-flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 rounded-full transition-all duration-200',
              'peer-checked:bg-syt-accent',
              'peer-focus:ring-2 peer-focus:ring-syt-accent peer-focus:ring-offset-2 peer-focus:ring-offset-syt-background',
              !checked && 'bg-syt-surface border border-syt-border',
              className
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-md',
                checked && 'translate-x-5'
              )}
            />
          </div>
        </div>
        {label && (
          <span className="text-syt-text select-none">{label}</span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';