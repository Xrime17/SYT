function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getDateBounds(): { minDate: string; maxDate: string } {
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const max = new Date(min.getFullYear() + 1, min.getMonth(), min.getDate());
  return { minDate: toYMD(min), maxDate: toYMD(max) };
}

/** Clamp a YYYY-MM-DD string: past → today, future beyond max → max, empty → empty. */
export function clampDate(value: string, minDate: string, maxDate: string): string {
  if (!value) return '';
  if (value < minDate) return minDate;
  if (value > maxDate) return maxDate;
  return value;
}
