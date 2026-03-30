/**
 * Отключает SWR-кэш и localStorage user cache.
 * true — только для отладки конкретного баги (каждый запрос всегда свежий).
 * false — нормальный режим: пользователь кешируется на 5 мин, SWR кешируется.
 */
export const CACHE_DISABLED =
  process.env.NEXT_PUBLIC_DISABLE_CACHE === 'true' ||
  process.env.NODE_ENV !== 'production';
