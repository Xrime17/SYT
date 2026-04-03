'use client';

export const RECURRING_FREQUENCIES = [
  { value: 'DAILY' as const, label: 'Daily' },
  { value: 'WEEKLY' as const, label: 'Weekly' },
  { value: 'MONTHLY' as const, label: 'Monthly' },
  { value: 'CUSTOM' as const, label: 'Custom interval' },
];

export const RECURRING_WEEKDAYS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

export type RecurringFieldValues = {
  frequency: (typeof RECURRING_FREQUENCIES)[number]['value'];
  daysOfWeek: number[];
  dayOfMonth: number;
  intervalDays: number;
  endDate: string;
};

export const defaultRecurringFieldValues = (): RecurringFieldValues => ({
  frequency: 'WEEKLY',
  daysOfWeek: [1],
  dayOfMonth: 1,
  intervalDays: 7,
  endDate: '',
});

/** Тело для `POST /recurring` (как на странице recurring/new). */
export function buildCreateRecurringPayload(
  taskId: string,
  v: RecurringFieldValues
): {
  taskId: string;
  frequency: string;
  interval?: number;
  daysOfWeek?: number[];
  endDate?: string;
} {
  const payload: {
    taskId: string;
    frequency: string;
    interval?: number;
    daysOfWeek?: number[];
    endDate?: string;
  } = { taskId, frequency: v.frequency };
  if (v.frequency === 'WEEKLY' && v.daysOfWeek.length > 0) {
    payload.daysOfWeek = v.daysOfWeek;
  }
  if (v.frequency === 'MONTHLY') {
    payload.interval = Math.max(1, Math.min(31, v.dayOfMonth));
  }
  if (v.frequency === 'CUSTOM') {
    payload.interval = Math.max(1, v.intervalDays);
  }
  if (v.endDate) {
    payload.endDate = new Date(v.endDate).toISOString();
  }
  return payload;
}

export function recurringFieldsValid(v: RecurringFieldValues): boolean {
  if (v.frequency === 'WEEKLY' && v.daysOfWeek.length === 0) return false;
  return true;
}

type RecurringRuleFieldsProps = {
  value: RecurringFieldValues;
  onChange: (patch: Partial<RecurringFieldValues>) => void;
};

export function RecurringRuleFields({ value, onChange }: RecurringRuleFieldsProps) {
  const { frequency, daysOfWeek, dayOfMonth, intervalDays, endDate } = value;

  const toggleDay = (d: number) => {
    onChange({
      daysOfWeek: daysOfWeek.includes(d)
        ? daysOfWeek.filter((x) => x !== d)
        : [...daysOfWeek, d].sort((a, b) => a - b),
    });
  };

  return (
    <div className="flex flex-col gap-6 border-t border-[var(--syt-border)] pt-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--syt-text)]">Frequency *</label>
        <div className="flex flex-wrap gap-2">
          {RECURRING_FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ frequency: f.value })}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                frequency === f.value
                  ? 'bg-[var(--syt-accent)] text-white'
                  : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-secondary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {frequency === 'WEEKLY' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--syt-text)]">Days of week</label>
          <div className="flex flex-wrap gap-2">
            {RECURRING_WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  daysOfWeek.includes(d.value)
                    ? 'bg-[var(--syt-accent)] text-white'
                    : 'border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text-secondary)]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {frequency === 'MONTHLY' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--syt-text)]">Day of month (1–31)</label>
          <input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => onChange({ dayOfMonth: parseInt(e.target.value, 10) || 1 })}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
          />
        </div>
      )}

      {frequency === 'CUSTOM' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--syt-text)]">Repeat every (days)</label>
          <input
            type="number"
            min={1}
            value={intervalDays}
            onChange={(e) => onChange({ intervalDays: parseInt(e.target.value, 10) || 1 })}
            className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--syt-text)]">End date (optional)</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onChange({ endDate: e.target.value })}
          className="w-full rounded-[10px] border border-[var(--syt-border)] bg-[var(--syt-card)] px-3 py-2.5 text-sm text-[var(--syt-text)] focus:outline-none focus:ring-2 focus:ring-[var(--syt-accent)]"
        />
      </div>
    </div>
  );
}
