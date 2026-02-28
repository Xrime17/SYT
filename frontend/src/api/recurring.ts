import { request } from './client';

export interface RecurringRule {
  id: string;
  taskId: string;
  frequency: string;
  interval: number;
  daysOfWeek: number[];
  endDate?: string | null;
}

export async function getRecurringByTask(taskId: string): Promise<RecurringRule> {
  return request<RecurringRule>(`/recurring/${taskId}`);
}

export async function createRecurring(data: {
  taskId: string;
  frequency: string;
  interval?: number;
  daysOfWeek?: number[];
  endDate?: string;
}): Promise<RecurringRule> {
  return request<RecurringRule>('/recurring', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRecurring(
  taskId: string,
  data: { frequency?: string; interval?: number; daysOfWeek?: number[]; endDate?: string | null }
): Promise<RecurringRule> {
  return request<RecurringRule>(`/recurring/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteRecurring(taskId: string): Promise<void> {
  await request(`/recurring/${taskId}`, { method: 'DELETE' });
}
