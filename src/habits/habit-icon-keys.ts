/** Пресеты иконок на Home; клиент мапит на SVG. */
export const HABIT_ICON_KEYS = [
  'water',
  'reading',
  'book',
  'clock',
  'list',
  'flame',
] as const;

export type HabitIconKey = (typeof HABIT_ICON_KEYS)[number];
