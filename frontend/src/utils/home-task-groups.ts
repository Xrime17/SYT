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

function completionTime(task: Task): number {
  return new Date(task.completedAt ?? task.updatedAt).getTime();
}

/** Four Home accordions + tasks outside the week (not shown on Home). */
export type HomeListKey = 'today' | 'tomorrow' | 'thisWeek' | 'completedThisWeek';

function sortHomeBucketTasks(tasks: Task[], key: HomeListKey): Task[] {
  if (key === 'completedThisWeek') {
    return [...tasks].sort((a, b) => completionTime(b) - completionTime(a));
  }
  const active = tasks.filter((t) => t.status !== 'COMPLETED');
  const done = tasks.filter((t) => t.status === 'COMPLETED');
  const sortedDone = [...done].sort((a, b) => completionTime(a) - completionTime(b));
  return [...active, ...sortedDone];
}

/**
 * Home lists (single source for /home):
 *
 * **Today / Tomorrow / This week** — активные задачи + выполненные **в текущий локальный день**
 * (`completedAt` / `updatedAt`), если по сроку они относятся к этой секции. Выполненные внизу списка.
 * После смены календарного дня такие задачи попадают только в **Completed this week**.
 *
 * **Completed this week** — завершённые в прошлые дни текущей недели (по дате завершения) и прочие
 * завершённые за неделю, не показанные выше.
 *
 * Задачи со сроком позже текущей недели на Home не показываются (полный список на `/tasks`).
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
      const completedIso = task.completedAt ?? task.updatedAt;
      const completedDayStr = toDateStrLocal(new Date(completedIso));

      if (completedDayStr < todayStr) {
        if (completedDayStr >= weekStartStr && completedDayStr <= weekEndStr) {
          buckets.completedThisWeek.push(task);
        }
        continue;
      }

      // completedDayStr === todayStr: остаёмся в today / tomorrow / this week (внизу после сортировки)
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
        continue;
      }
      if (completedDayStr >= weekStartStr && completedDayStr <= weekEndStr) {
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

  (Object.keys(buckets) as HomeListKey[]).forEach((key) => {
    buckets[key] = sortHomeBucketTasks(buckets[key], key);
  });

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
