# Быстрый старт: перенос экрана из Figma в код

Следуй шагам ниже. В качестве примера — экран **Reminders** (как на твоём макете).

---

## Шаг 1. Открой два окна

- **Figma:** фрейм «Reminders screen» (как у тебя сейчас).
- **Cursor:** файл `frontend/src/pages/reminders.tsx`.

Держи макет перед глазами и меняй код по нему.

---

## Шаг 2. Структура = сверху вниз, как в Figma

В макете «Reminders screen» порядок такой:

1. Заголовок **Reminders**
2. Пустое состояние (карточка «Reminders will appear here soon») **или** список карточек напоминаний
3. Блок **Create reminder**: поля Select task, Select date, Select time и кнопка **Create reminder**

В коде делаешь ту же структуру: один контейнер с `flex flex-col gap-6`, внутри — заголовок, потом список или пустое состояние, потом форма.

---

## Шаг 3. Стили только из дизайн-системы

- Фон страницы: `bg-[var(--syt-background)]` (#0F1117 как в Figma).
- Текст: `text-[var(--syt-text)]`, второстепенный — `text-[var(--syt-text-secondary)]`.
- Карточки: компонент `Card` (уже даёт `syt-glass-card` и нужный фон).
- Отступы: как в Auto Layout в Figma — padding 16, gap 24 → в Tailwind: `p-4`, `gap-6`.
- Кнопка: `<Button variant="primary">Create reminder</Button>`.

Никаких `from-slate-800`, `text-slate-500` — только переменные `--syt-*`.

---

## Шаг 4. Готовый пример для Reminders

Скопируй этот код в `frontend/src/pages/reminders.tsx`. Это разметка по макету: заголовок, пустое состояние, блок создания напоминания.

```tsx
'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyStateCard } from '@/components/EmptyStateCard';

export default function RemindersPage() {
  const [taskId, setTaskId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Пока без API — только вёрстка по Figma
  const hasReminders = false;

  return (
    <Layout>
      <div
        className="flex flex-col gap-6 p-4 max-w-[640px] mx-auto min-h-full"
        style={{ background: 'var(--syt-background)' }}
      >
        {/* 1. Заголовок — как в Figma */}
        <h1 className="text-xl font-semibold text-[var(--syt-text)]">
          Reminders
        </h1>

        {/* 2. Пустое состояние или список */}
        {hasReminders ? (
          <div className="flex flex-col gap-4">
            {/* Сюда карточки напоминаний: название задачи, время, бейдж Scheduled/Sent, Delete */}
          </div>
        ) : (
          <EmptyStateCard
            title="Reminders will appear here soon"
            className="min-h-[120px]"
          />
        )}

        {/* 3. Create reminder — как в Figma */}
        <Card className="flex flex-col gap-4 p-4">
          <p className="text-sm font-medium text-[var(--syt-text)]">
            Create reminder
          </p>
          <input
            type="text"
            placeholder="Select task..."
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--syt-surface)] border-[var(--syt-border)] text-[var(--syt-text)] placeholder-[var(--syt-text-muted)]"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--syt-surface)] border-[var(--syt-border)] text-[var(--syt-text)]"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-[var(--syt-surface)] border-[var(--syt-border)] text-[var(--syt-text)]"
          />
          <Button variant="primary" className="w-full">
            Create reminder
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
```

После вставки сохрани файл и открой страницу `/reminders` в приложении — увидишь экран по макету.

---

## Шаг 5. Остальные экраны — так же

| Экраны в Figma           | Файл в проекте              |
|--------------------------|-----------------------------|
| Reminders screen         | `pages/reminders.tsx`       |
| Recurring tasks screen   | `pages/recurring.tsx`       |
| Tasks list screen        | `pages/tasks/index.tsx`     |
| Create Task screen       | `pages/tasks/new.tsx`       |
| Daily Tracker screen     | `pages/tracker.tsx`         |
| Home screen              | `pages/index.tsx`           |

Для каждого: открой фрейм в Figma → открой соответствующий файл в Cursor → повтори структуру сверху вниз, используя компоненты (`Card`, `Button`, `EmptyStateCard` и т.д.) и токены `var(--syt-*)`.

---

## Важно

- **Тёмная тема:** чтобы фон и текст были как в Figma, на `<html>` должен висеть класс `dark` (настрой в `ThemeContext` или в `_app.tsx`).
- **Подробности** (что оставить в проекте, что заменить, чек-лист) — в [FIGMA_TO_PROJECT.md](./FIGMA_TO_PROJECT.md).
