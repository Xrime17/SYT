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
 * Monday of the Monday–Sunday week that contains `ref` (local calendar).
 */
export function startOfWeekMondayStr(ref: Date): string {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const jsDay = d.getDay();
  const daysFromMonday = jsDay === 0 ? 6 : jsDay - 1;
  const monday = addDaysLocal(d, -daysFromMonday);
  return toDateStrLocal(monday);
}

/**
 * End of the **Monday–Sunday** week that contains `ref` (Sunday’s date in local time).
 */
export function endOfWeekSundayStr(ref: Date): string {
  const d = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  const jsDay = d.getDay();
  const mondayBased = jsDay === 0 ? 6 : jsDay - 1;
  const daysUntilSunday = 6 - mondayBased;
  const sun = addDaysLocal(d, daysUntilSunday);
  return toDateStrLocal(sun);
}

function dueLocalStr(task: Task): string | null {
  if (!task.dueDate) return null;
  return toDateStrLocal(new Date(task.dueDate));
}

/** Four Home accordions + tasks outside the week (not shown on Home). */
export type HomeListKey = 'today' | 'tomorrow' | 'thisWeek' | 'completedThisWeek';

/**
 * Home lists (single source for /home):
 *
 * **Today** — active: undated inbox, overdue, due today; completed: only when due date is today (strikethrough in UI).
 *
 * **Tomorrow** — active only, due tomorrow.
 *
 * **This week** — active only, due after tomorrow through Sunday of current week (excludes today & tomorrow).
 *
 * **Completed this week** — `status === COMPLETED`, completion date (`updatedAt` local) within Monday–Sunday week.
 * Completed tasks with due date **today** appear only under Today (not duplicated here).
 *
 * Tasks with due beyond this week are omitted from Home (full list on `/tasks`).
 */
export function groupHomeLists(tasks: Task[], now: Date = new Date()): Record<HomeListKey, Task[]> {
  const todayStr = toDateStrLocal(now);
  const tomorrowStr = toDateStrLocal(addDaysLocal(now, 1));
  const weekStartStr = startOfWeekMondayStr(now);
  const weekEndStr = endOfWeekSundayStr(now);

  const buckets: Record<HomeListKey, Task[]> = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    completedThisWeek: [],
  };

  for (const task of tasks) {
    const due = dueLocalStr(task);

    if (task.status === 'COMPLETED') {
      const updStr = toDateStrLocal(new Date(task.updatedAt));
      if (due === todayStr) {
        buckets.today.push(task);
        continue;
      }
      if (updStr >= weekStartStr && updStr <= weekEndStr) {
        buckets.completedThisWeek.push(task);
      }
      continue;
    }

    if (!due) {
      buckets.today.push(task);
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
    }
  }

  return buckets;
}

/** @deprecated Use `groupHomeLists` and `HomeListKey`. */
export type HomeTaskGroup = 'today' | 'tomorrow' | 'thisWeek' | 'later';

/** @deprecated Use `groupHomeLists`. */
export function groupTasksForHome(tasks: Task[], now: Date = new Date()): Record<HomeTaskGroup, Task[]> {
  const next = groupHomeLists(tasks, now);
  return {
    today: next.today,
    tomorrow: next.tomorrow,
    thisWeek: next.thisWeek,
    later: [],
  };
}
