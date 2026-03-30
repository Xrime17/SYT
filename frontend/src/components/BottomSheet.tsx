'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  children: ReactNode;
};

export function BottomSheet({ open, onClose, title, titleId = 'bottom-sheet-title', children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (typeof document === 'undefined' || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end p-0"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 border-0 cursor-default bg-[var(--syt-overlay-backdrop)]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[1] mx-auto flex w-full max-w-[min(100%,var(--syt-content-max))] max-h-[85vh] flex-col rounded-t-[16px] border border-[var(--syt-border)] border-b-0 bg-[var(--syt-surface)] shadow-[var(--syt-shadow-soft)] safe-area-pb sm:mb-[max(env(safe-area-inset-bottom),16px)] sm:rounded-b-[16px] sm:border-b"
      >
        <div className="flex shrink-0 flex-col items-center pt-2 pb-1" aria-hidden>
          <div className="h-1 w-10 rounded-full bg-[var(--syt-border)]" />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--syt-border)] px-4 pb-3">
          <h2 id={titleId} className="text-lg font-semibold text-[var(--syt-text)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-xl text-[var(--syt-text-muted)] hover:bg-[var(--syt-card)] hover:text-[var(--syt-text)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
