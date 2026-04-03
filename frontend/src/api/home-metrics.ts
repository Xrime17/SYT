import { request } from './client';

/** `totalHabits` — число активных привычек (`Habit` без `archivedAt`). */
export type HomeSubtitleMetrics = {
  totalHabits: number;
  metric: 'activeHabitsCount';
};

export async function getHomeSubtitleMetrics(userId: string): Promise<HomeSubtitleMetrics> {
  return request<HomeSubtitleMetrics>('/categories/home-metrics', {
    params: { userId },
  });
}
