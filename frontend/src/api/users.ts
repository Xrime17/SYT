import { request } from './client';

export interface User {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName: string;
  lastName?: string | null;
  timezone: string;
  planType: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUserById(id: string): Promise<User> {
  return request<User>(`/users/${id}`);
}

export async function getUserByTelegramId(telegramId: string): Promise<User> {
  return request<User>(`/users/telegram/${telegramId}`);
}

export async function createUser(data: {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  timezone?: string;
}): Promise<User> {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
