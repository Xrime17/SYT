'use client';

import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
  label,
  checked,
  onCheckedChange,
  disabled,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const inputId = id ?? `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <label
      htmlFor={inputId}
      className={`
        inline-flex items-center gap-3 cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span
        className={`
          flex shrink-0 w-6 h-6 rounded-md border-2 items-center justify-center
          transition-all duration-200
          ${checked
            ? 'bg-[var(--syt-accent)] border-[var(--syt-accent)]'
            : 'bg-[var(--syt-surface)] border-[var(--syt-border)] hover:border-[var(--syt-accent-glow)]'
          }
        `}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className="sr-only"
        {...props}
      />
      {label && (
        <span className="text-sm font-medium text-[var(--syt-text)]">{label}</span>
      )}
    </label>
  );
}
