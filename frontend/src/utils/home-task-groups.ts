import type { Task } from '@/api/tasks';

/** Local calendar day `YYYY-MM-DD` (same idea as tracker). */
export function toDateStrLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysLocal(base: Date, delta: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + delta);
  return d;
}

/**
 * End of the **Monday–Sunday** week that contains `ref` (Sunday’s date in local time).
 * Used for "This week" bucket: from day-after-tomorrow through this Sunday inclusive.
 */
export function endOfWeekSundayStr(ref: Date): string {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const jsDay = d.getDay(); // 0 Sun .. 6 Sat
  const mondayBased = jsDay === 0 ? 6 : jsDay - 1; // Mon=0 .. Sun=6
  const daysUntilSunday = 6 - mondayBased;
  const sun = addDaysLocal(d, daysUntilSunday);
  return toDateStrLocal(sun);
}

function dueLocalStr(task: Task): string | null {
  if (!task.dueDate) return null;
  return toDateStrLocal(new Date(task.dueDate));
}

export type HomeTaskGroup = 'today' | 'tomorrow' | 'thisWeek' | 'later';

/**
 * Home grouping rules (single source for /home):
 *
 * **Today**
 * - `dueDate` falls on the local calendar **today**, OR
 * - `dueDate` is **before today** (overdue) — still shown under Today for attention, OR
 * - **No `dueDate` and status is ACTIVE** (inbox / undated active work)
 *
 * **Tomorrow** — `dueDate` on local tomorrow.
 *
 * **This week** — `dueDate` strictly after tomorrow and on or before **Sunday** of the
 * current Monday–Sunday week (see `endOfWeekSundayStr`).
 *
 * **Later** — everything else (future beyond this week, no due + completed, ARCHIVED, etc.).
 * Full list remains on `/tasks`.
 */
export function groupTasksForHome(tasks: Task[], now: Date = new Date()): Record<HomeTaskGroup, Task[]> {
  const todayStr = toDateStrLocal(now);
  const tomorrowStr = toDateStrLocal(addDaysLocal(now, 1));
  const weekEndStr = endOfWeekSundayStr(now);

  const buckets: Record<HomeTaskGroup, Task[]> = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
  };

  for (const task of tasks) {
    const due = dueLocalStr(task);

    if (!due && task.status === 'ACTIVE') {
      buckets.today.push(task);
      continue;
    }

    if (!due) {
      buckets.later.push(task);
      continue;
    }

    if (due < todayStr || due === todayStr) {
      buckets.today.push(task);
      continue;
    }

    if (due === tomorrowStr) {
      buckets.tomorrow.push(task);
      continue;
    }

    if (due > tomorrowStr && due <= weekEndStr) {
      buckets.thisWeek.push(task);
      continue;
    }

    buckets.later.push(task);
  }

  return buckets;
}
