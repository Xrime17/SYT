'use client';

import React from 'react';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--syt-accent)] text-white shadow-[0_0_20px_var(--syt-accent-glow)]/30 hover:opacity-90 hover:shadow-[0_0_24px_var(--syt-accent-glow)]/40 active:opacity-95 disabled:opacity-50 disabled:shadow-none border border-transparent',
  secondary:
    'bg-[var(--syt-surface)] text-[var(--syt-text)] border border-[var(--syt-border)] hover:bg-[var(--syt-card)] active:opacity-90 disabled:opacity-50',
  ghost:
    'bg-transparent text-[var(--syt-text-secondary)] border border-transparent hover:bg-[var(--syt-glass-bg)] hover:text-[var(--syt-text)] active:opacity-90 disabled:opacity-50',
  danger:
    'bg-[var(--syt-error)] text-white border border-transparent hover:opacity-90 active:opacity-95 disabled:opacity-50',
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-[var(--syt-radius-button)]
        px-5 py-2.5 text-sm font-medium transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--syt-background)]
        active:scale-[0.98]
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="w-4 h-4" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
