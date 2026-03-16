/**
 * Отключает SWR-кэш и localStorage user cache.
 * true — только для отладки конкретного баги (каждый запрос всегда свежий).
 * false — нормальный режим: пользователь кешируется на 5 мин, SWR кешируется.
 */
export const CACHE_DISABLED = false;
