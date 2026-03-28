import { request } from './client';

/**
 * Семантика `totalHabits` задаётся сервером в `metric`.
 * Сейчас: число чипов Home (`HomeCategory`), не отдельная сущность Habit с completion за день.
 */
export type HomeSubtitleMetrics = {
  totalHabits: number;
  metric: 'homeCategoriesCount';
};

export async function getHomeSubtitleMetrics(userId: string): Promise<HomeSubtitleMetrics> {
  return request<HomeSubtitleMetrics>('/categories/home-metrics', {
    params: { userId },
  });
}
