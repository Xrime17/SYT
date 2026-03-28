import { request } from './client';

/** Соответствует `CategoryChipJson` бэкенда (`GET /categories`): id, label, iconKey + поля UI. */
export interface HomeCategory {
  id: string;
  label: string;
  iconKey: string;
  shortLabel: string;
  sortOrder: number;
  emoji: string | null;
  createdAt: string;
}

export type CreateHomeCategoryPayload = {
  userId: string;
  label: string;
  shortLabel?: string;
  emoji?: string;
  sortOrder?: number;
};

export type PatchHomeCategoryPayload = {
  userId?: string;
  label?: string;
  shortLabel?: string;
  emoji?: string | null;
  sortOrder?: number;
};

export type ReorderHomeCategoriesPayload = {
  userId: string;
  orderedIds: string[];
};

export async function getHomeCategories(userId: string): Promise<HomeCategory[]> {
  return request<HomeCategory[]>('/categories', {
    params: { userId },
  });
}

export async function createHomeCategory(
  data: CreateHomeCategoryPayload
): Promise<HomeCategory> {
  return request<HomeCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function patchHomeCategory(
  categoryId: string,
  data: PatchHomeCategoryPayload
): Promise<HomeCategory> {
  return request<HomeCategory>(`/categories/${encodeURIComponent(categoryId)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteHomeCategory(userId: string, categoryId: string): Promise<void> {
  await request<void>(`/categories/${encodeURIComponent(categoryId)}`, {
    method: 'DELETE',
    params: { userId },
  });
}

export async function reorderHomeCategories(
  userId: string,
  orderedIds: string[]
): Promise<HomeCategory[]> {
  const body: ReorderHomeCategoriesPayload = { userId, orderedIds };
  return request<HomeCategory[]>('/categories/reorder', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
