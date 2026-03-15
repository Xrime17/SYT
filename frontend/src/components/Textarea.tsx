'use client';

import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--syt-text)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full min-h-[100px] rounded-[var(--syt-radius-input)] border bg-[var(--syt-surface)]
          px-4 py-3 text-[var(--syt-text)] placeholder-[var(--syt-text-muted)]
          border-[var(--syt-border)] focus:border-[var(--syt-accent)] focus:ring-2 focus:ring-[var(--syt-accent)]/20 outline-none
          transition-all duration-200 resize-y
          disabled:opacity-50
          ${error ? 'border-[var(--syt-error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-[var(--syt-error)]">{error}</p>
      )}
    </div>
  );
}
