import { request } from './client';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  type: string;
  status: string;
  priority: string;
  dueDate?: string | null;
  /** FK на HomeCategory; null — без категории. */
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
  recurringRuleId?: string | null;
  generatedDate?: string | null;
}

/** Сегмент ключа SWR: на сервер `categoryId` не передаётся (все задачи пользователя). */
export const TASKS_LIST_SWR_ALL_SEGMENT = 'all' as const;

/**
 * Ключ SWR для списка задач (Home, /tasks, …) без фильтра по дню — tracker использует отдельный ключ.
 * Третий сегмент совпадает с опциональным query `categoryId` у `GET /tasks/:userId` (фаза 2.2).
 */
export function tasksListSwrKey(
  userId: string,
  homeCategoryId: string | null | undefined,
): readonly ['tasks', string, string] {
  return ['tasks', userId, homeCategoryId ?? TASKS_LIST_SWR_ALL_SEGMENT];
}

export async function getTasks(
  userId: string,
  date?: string,
  timezone?: string,
  timezoneOffsetMinutes?: number,
  /** Фильтр по HomeCategory; не передавать — все задачи пользователя. */
  categoryId?: string,
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (timezone) params.set('timezone', timezone);
  if (typeof timezoneOffsetMinutes === 'number') params.set('timezoneOffsetMinutes', String(timezoneOffsetMinutes));
  if (categoryId) params.set('categoryId', categoryId);
  const qs = params.toString();
  const url = qs ? `/tasks/${userId}?${qs}` : `/tasks/${userId}`;
  return request<Task[]>(url);
}

/** Fetcher для ключа из `tasksListSwrKey` — только серверный фильтр, без клиентского по `task.categoryId`. */
export function fetchTasksListForSwrKey(key: readonly ['tasks', string, string]): Promise<Task[]> {
  const [, uid, catSegment] = key;
  return getTasks(
    uid,
    undefined,
    undefined,
    undefined,
    catSegment === TASKS_LIST_SWR_ALL_SEGMENT ? undefined : catSegment,
  );
}

export async function getTaskById(taskId: string): Promise<Task> {
  return request<Task>(`/tasks/task/${taskId}`);
}

export async function createTask(data: {
  userId: string;
  title: string;
  description?: string;
  type?: string;
  priority?: string;
  dueDate?: string | null;
  categoryId?: string;
}): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    type?: string;
    dueDate?: string | null;
    categoryId?: string | null;
  }
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  await request(`/tasks/${taskId}`, { method: 'DELETE' });
}
