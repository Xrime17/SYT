import { request } from './client';

export interface Reminder {
  id: string;
  taskId: string;
  remindAt: string;
  sent: boolean;
  task?: { title: string };
}

/** Значения `appliedRule` с бэкенда (`RemindersService` / `POST /reminders/quick`). */
export type QuickReminderAppliedRule =
  | 'taskDueDate'
  | 'pastDueOneHourFromNow'
  | 'defaultTomorrow9Utc'
  | 'unchangedExistingUnsent';

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

/** Ответ POST /reminders/quick и POST /tasks/:taskId/quick-reminder */
export type SetQuickReminderResult =
  | {
      enabled: true;
      reminder: Reminder;
      appliedRule: QuickReminderAppliedRule;
      ruleDescription: string;
    }
  | { enabled: false; removed: boolean };

export type SetHomeQuickReminderPayload = {
  taskId: string;
  userId: string;
  /** `true` — включить быстрое напоминание; `false` — снять */
  enabled: boolean;
};

/** Одно напоминание на задачу: включить (дефолтное время) или выключить (удалить). */
export async function setQuickReminder(
  data: SetHomeQuickReminderPayload
): Promise<SetQuickReminderResult> {
  return request<SetQuickReminderResult>('/reminders/quick', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Колокольчик на Home (фаза 2): то же, что `setQuickReminder` → `POST /reminders/quick`.
 * Для REST по `taskId` см. `enableTaskQuickReminder` / `disableTaskQuickReminder`.
 */
export async function toggleHomeQuickReminder(
  taskId: string,
  userId: string,
  enabled: boolean
): Promise<SetQuickReminderResult> {
  return setQuickReminder({ taskId, userId, enabled });
}

/** REST по taskId: быстрое напоминание (то же правило времени, что и /reminders/quick). */
export async function enableTaskQuickReminder(
  taskId: string,
  userId: string
): Promise<Extract<SetQuickReminderResult, { enabled: true }>> {
  return request(`/tasks/${encodeURIComponent(taskId)}/quick-reminder`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function disableTaskQuickReminder(
  taskId: string,
  userId: string
): Promise<Extract<SetQuickReminderResult, { enabled: false }>> {
  return request(`/tasks/${encodeURIComponent(taskId)}/quick-reminder`, {
    method: 'DELETE',
    params: { userId },
  });
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await request(`/reminders/${reminderId}`, { method: 'DELETE' });
}
