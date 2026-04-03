import { request } from './client';

export const HABIT_ICON_KEYS = [
  'water',
  'reading',
  'book',
  'clock',
  'list',
  'flame',
] as const;

export type HabitIconKey = (typeof HABIT_ICON_KEYS)[number];

export type HabitListItem = {
  id: string;
  title: string;
  iconKey: string;
  targetPerDay: number;
  sortOrder: number;
  todayCount: number;
  doneToday: boolean;
};

export async function getHabits(userId: string): Promise<HabitListItem[]> {
  return request<HabitListItem[]>(`/habits/user/${encodeURIComponent(userId)}`);
}

export async function createHabit(body: {
  userId: string;
  title: string;
  iconKey: string;
  targetPerDay?: number;
}): Promise<HabitListItem> {
  return request<HabitListItem>('/habits', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateHabit(
  habitId: string,
  body: {
    userId: string;
    title?: string;
    iconKey?: string;
    targetPerDay?: number;
    sortOrder?: number;
    archived?: boolean;
  }
): Promise<HabitListItem> {
  return request<HabitListItem>(`/habits/${encodeURIComponent(habitId)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function incrementHabit(habitId: string, userId: string): Promise<HabitListItem> {
  return request<HabitListItem>(`/habits/${encodeURIComponent(habitId)}/increment`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function decrementHabit(habitId: string, userId: string): Promise<HabitListItem> {
  return request<HabitListItem>(`/habits/${encodeURIComponent(habitId)}/decrement`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}
