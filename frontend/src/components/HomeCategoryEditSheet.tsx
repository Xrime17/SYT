'use client';

import { useCallback, useEffect, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import {
  createHomeCategory,
  patchHomeCategory,
  type HomeCategory,
} from '@/api/home-categories';

export type HomeCategoryEditSheetProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  mode: 'create' | 'edit';
  category?: HomeCategory | null;
  onSaved: () => void | Promise<void>;
};

export function HomeCategoryEditSheet({
  open,
  onClose,
  userId,
  mode,
  category,
  onSaved,
}: HomeCategoryEditSheetProps) {
  const [label, setLabel] = useState('');
  const [shortLabel, setShortLabel] = useState('');
  const [emoji, setEmoji] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (mode === 'edit' && category) {
      setLabel(category.label);
      setShortLabel(category.shortLabel);
      setEmoji(category.emoji ?? '');
      setSortOrder(String(category.sortOrder));
    } else {
      setLabel('');
      setShortLabel('');
      setEmoji('');
      setSortOrder('');
    }
  }, [open, mode, category?.id, category?.label, category?.shortLabel, category?.emoji, category?.sortOrder]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = label.trim();
      if (!trimmed) {
        setError('Label is required');
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const sortParsed = sortOrder.trim() === '' ? undefined : parseInt(sortOrder.trim(), 10);
        if (sortParsed !== undefined && (Number.isNaN(sortParsed) || sortParsed < 0 || sortParsed > 9999)) {
          setError('Order must be 0–9999');
          setLoading(false);
          return;
        }

        if (mode === 'create') {
          await createHomeCategory({
            userId,
            label: trimmed,
            ...(shortLabel.trim() ? { shortLabel: shortLabel.trim() } : {}),
            ...(emoji.trim() ? { emoji: emoji.trim() } : {}),
            ...(sortParsed !== undefined ? { sortOrder: sortParsed } : {}),
          });
        } else if (category) {
          const effectiveShort =
            shortLabel.trim() ||
            (trimmed.length <= 2 ? trimmed.toUpperCase() : trimmed.slice(0, 2).toUpperCase());
          await patchHomeCategory(category.id, {
            userId,
            label: trimmed,
            shortLabel: effectiveShort,
            emoji: emoji.trim() === '' ? null : emoji.trim(),
            ...(sortParsed !== undefined ? { sortOrder: sortParsed } : {}),
          });
        }
        await onSaved();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Request failed');
      } finally {
        setLoading(false);
      }
    },
    [label, shortLabel, emoji, sortOrder, mode, category, userId, onSaved, onClose]
  );

  const title = mode === 'create' ? 'New category' : 'Edit category';

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-xs text-[var(--syt-text-muted)]">
          Tip: long-press a chip on Home to edit. Order controls left-to-right position (smaller first).
        </p>
        <div className="flex flex-col gap-2">
          <label htmlFor="hc-label" className="text-sm font-medium text-[var(--syt-text)]">
            Label *
          </label>
          <input
            id="hc-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            placeholder="e.g. Meditation"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hc-short" className="text-sm font-medium text-[var(--syt-text)]">
            Short label (chip)
          </label>
          <input
            id="hc-short"
            value={shortLabel}
            onChange={(e) => setShortLabel(e.target.value.slice(0, 8))}
            maxLength={8}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            placeholder="Auto from label if empty"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hc-emoji" className="text-sm font-medium text-[var(--syt-text)]">
            Emoji (optional)
          </label>
          <input
            id="hc-emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value.slice(0, 32))}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] placeholder-[var(--syt-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            placeholder="Clear field to remove"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hc-order" className="text-sm font-medium text-[var(--syt-text)]">
            Sort order
          </label>
          <input
            id="hc-order"
            type="number"
            min={0}
            max={9999}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
            placeholder={mode === 'create' ? 'Auto (append)' : ''}
          />
        </div>
        {error && <p className="text-sm text-[var(--syt-error)]">{error}</p>}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-2">
          <Button type="button" variant="secondary" className="rounded-xl py-2.5 w-full sm:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="primary" className="rounded-xl py-2.5 w-full sm:flex-1">
            {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
