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
  createdAt: string;
  updatedAt: string;
  recurringRuleId?: string | null;
  generatedDate?: string | null;
}

export async function getTasks(userId: string, date?: string): Promise<Task[]> {
  const url = date ? `/tasks/${userId}?date=${encodeURIComponent(date)}` : `/tasks/${userId}`;
  return request<Task[]>(url);
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
}): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string; status?: string; priority?: string; dueDate?: string | null }
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  await request(`/tasks/${taskId}`, { method: 'DELETE' });
}
