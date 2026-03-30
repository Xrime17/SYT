'use client';

import { useEffect, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';

export type HomeReminderSheetProps = {
  open: boolean;
  onClose: () => void;
  /** ISO string for `remindAt` */
  onSave: (remindAtIso: string) => void | Promise<void>;
};

export function HomeReminderSheet({ open, onClose, onSave }: HomeReminderSheetProps) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setValue('');
      setBusy(false);
    }
  }, [open]);

  const parsed = value ? new Date(value) : null;
  const canSave = Boolean(parsed && !Number.isNaN(parsed.getTime()));

  const handleSave = async () => {
    if (!canSave || !parsed) return;
    setBusy(true);
    try {
      await onSave(parsed.toISOString());
      onClose();
    } catch {
      /* ошибка показывается родителем */
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Reminder">
      <p className="mb-3 text-sm text-[var(--syt-text-secondary)]">Choose date and time for the reminder.</p>
      <label className="mb-4 block text-sm font-medium text-[var(--syt-text)]">
        Date and time
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full rounded-[var(--syt-radius-input)] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2 text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          className="rounded-xl sm:order-1"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="rounded-xl sm:order-2"
          onClick={() => void handleSave()}
          disabled={!canSave || busy}
        >
          Save
        </Button>
      </div>
    </BottomSheet>
  );
}
