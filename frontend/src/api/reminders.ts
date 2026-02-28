import { request } from './client';

export interface Reminder {
  id: string;
  taskId: string;
  remindAt: string;
  sent: boolean;
}

export async function getRemindersForUser(userId: string): Promise<Reminder[]> {
  return request<Reminder[]>(`/reminders/user/${userId}`);
}

export async function createReminder(data: {
  taskId: string;
  remindAt: string; // ISO 8601
}): Promise<Reminder> {
  return request<Reminder>('/reminders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await request(`/reminders/${reminderId}`, { method: 'DELETE' });
}
