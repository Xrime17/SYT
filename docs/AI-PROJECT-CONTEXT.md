# Syt — контекст для ИИ и разработки

Документ для быстрого восстановления контекста после сброса чата. Обновляйте при крупных изменениях в архитектуре или IA.

---

## 1. Что за репозиторий

- **Backend:** NestJS + Prisma + PostgreSQL (корень `package.json` — `nest-backend`, исходники в `src/`).
- **Frontend:** Next.js (Pages Router) в `frontend/` — Telegram Mini App «Syt» (задачи, трекер, напоминания).
- **`ai-system/`:** отдельный Vite/React **design kit / демо UI** из Figma-экспорта. **Не** npm-зависимость `frontend/`. Используется как **визуальный и UX-референс**; в продукт переносятся паттерны и токены, не импорты пакета.

---

## 2. Информационная архитектура и маршруты

Спека: `ai-system/NAVIGATION_IA.md` (Home vs Tracker, пять табов).

**Корень:** `frontend/src/pages/index.tsx` делает **`router.replace('/home')`** — лендинг приложения = **Home**.

**Нижняя навигация (мобильная):** `frontend/src/components/Layout.tsx`  
Порядок табов: **Home → Tracker → Tasks → Recurring → Reminders**  
Маршруты: `/home`, `/tracker`, `/tasks`, `/recurring`, `/reminders`.  
Высота таббара **52px**; активный цвет `var(--syt-accent)`, неактивный `var(--syt-text-secondary)`. На `sm+` дублируется горизонтальная навигация в шапке. Логотип «Syt» ведёт на `/home`.

**Соответствие экранов Figma → файлам:** см. `.cursor/rules/syt-pages-figma.mdc`.

| Экран        | Файл страницы                    |
|-------------|-----------------------------------|
| Home        | `frontend/src/pages/home.tsx`     |
| Settings    | `frontend/src/pages/settings.tsx` (иконка в хедере Home → `/settings`, тот же `Layout` с таббаром) |
| Tracker     | `frontend/src/pages/tracker.tsx`  |
| Tasks       | `frontend/src/pages/tasks/index.tsx`, детали `tasks/[id].tsx`, создание `tasks/new.tsx` |
| Recurring   | `frontend/src/pages/recurring.tsx`, `recurring/new.tsx` |
| Reminders   | `frontend/src/pages/reminders.tsx`|

---

## 3. Дизайн-система (продукт)

- **Токены:** только CSS-переменные `var(--syt-*)` в UI. Определены в `frontend/src/styles/globals.css` (светлая заглушка в `:root`, основная тёмная — `.dark` / `[data-theme="dark"]`).
- **Правила Cursor:** `.cursor/rules/syt-frontend-design.mdc` (токены, тёмная тема, переиспользование `@/components`, не вырезать Layout без запроса).
- **Home-референс:** `.cursor/rules/syt-home-design-reference.mdc` — при правках Home смотреть `ai-system/.../HomeScreen.tsx`, `TaskCard.tsx`, `NAVIGATION_IA.md`.

Запрещено в продуктовом UI: «сырые» Tailwind light-палитры вроде `slate-*`, `indigo-*` для основного хрома — только семантика `--syt-*`.

---

## 4. Home (`/home`) — что реализовано

**Данные (SWR):**

- **Задачи:** ключ `tasksListSwrKey(userId, categoryId | null)` + `fetchTasksListForSwrKey` → `getTasks` из `frontend/src/api/tasks.ts`. Опциональный query **`categoryId`** (HomeCategory): чип «All» = без query, иначе сервер отдаёт только задачи категории. Группировка на клиенте по **уже отфильтрованному** списку.
- **Категории Home:** ключ `['home-categories', userId]` → `getHomeCategories` (`frontend/src/api/home-categories.ts`), бэкенд `HomeCategory` (CRUD/reorder в модуле `categories`).
- **Метрика подзаголовка:** ключ `['homeMetrics', userId]` → `getHomeSubtitleMetrics` → **`GET /categories/home-metrics?userId=`** — поле `totalHabits` (продуктово = **число записей `HomeCategory` у пользователя**, не отдельная сущность Habit).
- **Напоминания для колокольчика:** ключ `['reminders', userId]` → список напоминаний пользователя (как на `/reminders`), чтобы флаг на карточке совпадал с сервером.

**Группировка:** единая логика в `frontend/src/utils/home-task-groups.ts` — функция `groupTasksForHome(tasks, now?)`.

- **Today:** срок сегодня или раньше (просрочка); **или** нет `dueDate` и статус `ACTIVE` (инбокс); **или** дата в прошлом относительно «сегодня» в локальном календаре.
- **Tomorrow:** локальный завтра.
- **This week:** строго после завтра и до **воскресенья текущей недели (неделя Пн–Вс)** — см. `endOfWeekSundayStr`.
- **Later:** всё остальное (в т.ч. без даты не-ACTIVE, архив, далекое будущее).

**UI:**

- Липкий внутренний хедер: заголовок Home, подзаголовок «Today · N tasks · M habits» — **`M` = `totalHabits` с API** (см. выше), пока метрика грузится допустим fallback на длину списка чипов.
- **Settings:** ссылка на **`/settings`** (`frontend/src/pages/settings.tsx`) — заголовок, выход, placeholder-секции, общий `Layout` с таббаром.
- **Категории:** чипы из API (`HomeCategoryFilterChip`), чип «All», long-press / контекстное меню → редактирование (`HomeCategoryEditSheet`), «+» — создание категории. Фильтр влияет на запрос задач (см. выше), не только на клиент.
- **Три аккордеона (Radix):** `SytAccordion` — Today (открыт по умолчанию), Tomorrow, This week. Секция **Later отдельным аккордеоном не показывается** — задачи из `later` **вклеиваются в список «This week»** (`includeLater: true`).
- Карточки задач: **`HomeTaskCard`** по образцу `ai-system/.../TaskCard.tsx` (edit/delete в углу, колокольчик, Checkbox и т.д.).
- **Колокольчик на Home:** **синхронизирован с бэкендом** — состояние из SWR-списка напоминаний (есть неснятое напоминание по `taskId`); переключение → **`toggleHomeQuickReminder`** (`POST` / `DELETE` **`/tasks/:taskId/quick-reminder`**, см. `RemindersService.setQuickReminder`), оптимистичное обновление кэша с откатом при ошибке; до первой загрузки списка напоминаний toggle отключён.
- **Пустой список:** `HomeEmptyState` (иконка, текст, кнопка открывает тот же `BottomSheet`, что FAB).
- **FAB:** фиксированная кнопка «+»; `bottom: calc(52px + env(safe-area-inset-bottom) + 16px)` чтобы не перекрывать таббар.
- **Bottom sheet** создания задачи: `BottomSheet` + `CreateTaskForm` (категории подставляются из того же кэша `home-categories`, что и чипы); тот же паттерн на `/tasks/new` (SWR-ключ категорий совпадает с Home).

**Мутации:** `updateTask`, `deleteTask`, локальное обновление кэша задач; напоминания — mutate ключа `reminders`; после сохранения категорий — `mutate` категорий и метрики подзаголовка.

---

## 5. Tracker (`/tracker`)

Один выбранный **день**, навигация по датам, `getTasks` с параметрами `date`, `timezone`, `timezoneOffsetMinutes` (см. `frontend/src/utils/locale.ts`). Не дублировать логику «недели» с Home без необходимости — у Tracker другая модель (сутки).

---

## 6. Общие компоненты (frontend)

Имеет смысл переиспользовать из `frontend/src/components/`: `Layout`, `Button`, `Card`, `Input`, `Textarea`, `Checkbox`, `Spinner`, `PriorityBadge`, `HomeTaskCard`, `HomeEmptyState`, `SytAccordion`, `HomeCategoryFilterChip`, `HomeCategoryEditSheet`, `BottomSheet`, `CreateTaskForm`, `ErrorCard`, `EmptyStateCard`, и т.д.

**Оверлей:** в `globals.css` есть `--syt-overlay-backdrop` для затемнения под шитами/модалками.

---

## 7. Backend (кратко)

- Модули в `src/` (Nest): например `tasks`, `reminders`, `categories` (HomeCategory + `home-metrics`), `telegram`, `users`.
- Prisma-схема в репозитории (генерация `prisma generate`).

Детали эндпоинтов — смотреть контроллеры и `frontend/src/api/*.ts`.

---

## 8. Что намеренно не сделано / очевидные продолжения

- **Отдельная сущность Habit** с completion / «активные привычки на сегодня» — нет; счётчик **habits** в шапке = **`HomeCategory` count** через `home-metrics` (см. §4).
- Полное визуальное паритетство с `ai-system` (Lucide на всех экранах, каждый пиксель макета) — не цель; продукт на своих компонентах и токенах.
- Экспорт дизайна: в `ai-system/` может лежать архив `AI-System-design-export.zip` (резерв копии макета).

---

## 9. Как использовать этот файл в чате

Коротко: *«Прочитай `docs/AI-PROJECT-CONTEXT.md` и правь X»* — чтобы новая сессия выровнялась по IA, границам `ai-system` vs `frontend`, правилам токенов и текущему состоянию Home/группировки.

При существенных изменениях в проекте **обновите разделы 4, 8 и таблицу маршрутов (§2)**, чтобы документ оставался правдой.
