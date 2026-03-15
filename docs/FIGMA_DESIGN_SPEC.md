# Figma design spec: Syt — dark theme Telegram Mini App

Use this doc to build a **Figma file** for the task tracker **Syt** (Telegram Mini App).  
Target: **modern dark UI**, Linear / Raycast / Arc style, **glass cards**, **soft gradients**, **subtle glow**, **minimal layout**, **friendly empty states**.  
Audience: US, Europe, Russia.  
**Use auto-layout on every frame and component.**

---

## 1. Design system

### 1.1 Color palette (dark theme)

- **Background**
  - Base: `#0D0D0F` or `#111113`
  - Elevated / surface: `#161618` — `#1C1C1E`
  - Card / glass base: `rgba(22, 22, 24, 0.6)` – `rgba(28, 28, 30, 0.8)`

- **Text**
  - Primary: `#F4F4F5` – `#FAFAFA`
  - Secondary / muted: `#71717A` – `#A1A1AA`
  - Tertiary / hint: `#52525B`

- **Accent (glow / CTAs)**
  - Primary: `#6366F1` (indigo)
  - Glow: `rgba(99, 102, 241, 0.25)` – `0.4`
  - Hover: `#818CF8`
  - Optional secondary accent: soft violet `#8B5CF6` for gradients

- **Borders / dividers**
  - Default: `rgba(255, 255, 255, 0.06)` – `0.08`
  - Subtle: `rgba(255, 255, 255, 0.04)`

- **Semantic**
  - Success: `#22C55E` (soft)
  - Error / destructive: `#EF4444` or `#F87171` (soft)
  - Warning: `#EAB308` or amber tint

### 1.2 Typography

- **Font**: one clean sans (e.g. Inter, SF Pro, or Geist). Support EN / RU.
- **Scale**
  - Hero / page title: 24–28px, semibold, -0.02 letter-spacing
  - Section title: 18–20px, semibold
  - Body: 15–16px, regular; line-height 1.45–1.5
  - Small / caption: 13px, regular or medium; color secondary
  - Nav / tabs: 12–13px, medium
- **Weights**: Regular (400), Medium (500), Semibold (600).

### 1.3 Spacing & radius

- **Spacing scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- **Card padding**: 16–20px; list item padding 12–16px.
- **Radius**: cards 12–16px; buttons 10–12px; inputs 10–12px; avatars 50%.

### 1.4 Effects (glass, gradient, glow)

- **Glass / frosted cards**
  - Background: `rgba(22, 22, 24, 0.6)` + blur (e.g. 20–24px).
  - Border: 1px `rgba(255,255,255,0.06)`.
  - Optional: very subtle gradient overlay for depth.

- **Gradients**
  - Background: soft radial or linear, e.g. dark center `#0D0D0F` → edges `#1A1A1E` or slight indigo tint.
  - Accent gradient: e.g. `#6366F1` → `#8B5CF6` for buttons or highlights.

- **Glow**
  - Accent glow: box-shadow or blur layer, e.g. `0 0 24px rgba(99, 102, 241, 0.2)`.
  - Use sparingly on primary buttons, active nav, or empty-state illustrations.

### 1.5 Design tokens (Figma variables)

Create variables for:

- Colors: background, surface, text primary/secondary, accent, border, semantic.
- Spacing: 4–64.
- Radius: sm (8), md (12), lg (16), full (9999).
- Typography: font, sizes, weights.

Use **auto-layout** for all components; bind padding/gap to spacing tokens.

---

## 2. Components (all with auto-layout)

### 2.1 Buttons

- **Primary**: filled accent, rounded, padding 12–16 vertical / 20–24 horizontal. Optional soft glow. States: default, hover, pressed, disabled.
- **Secondary**: outline or subtle fill (`rgba(255,255,255,0.06)`), same radius/padding.
- **Ghost / text**: no fill; hover: light background.

Variants: default, small (e.g. icon-only or compact text).

### 2.2 Cards (glass)

- **Container**: glass background (fill + blur), border, radius 12–16px, padding 16–20px. Auto-layout vertical, gap 12–16.
- **Task card**: same style; content: checkbox + title + optional meta (status, due date). Hover: slight border brighten or glow. Optional delete icon on hover.

### 2.3 Inputs

- **Text field**: dark fill (`#161618` or glass), border, radius 10–12px, padding 12–16px. Placeholder: secondary text color. Focus: accent border or glow.

### 2.4 Navigation

- **Header (desktop)**: horizontal auto-layout; logo “Syt”, date (caption), nav links (Трекер, Задачи, Повторения, Напоминания), spacer, avatar + close button.
- **Bottom nav (mobile)**: 4 items, icons + labels; active state: accent color + optional pill/bg. Safe area padding.

### 2.5 Task item

- Checkbox (empty / checked), title (single line truncate), optional row: status pill + due date. Delete icon visible on hover. Support “completed” state: strikethrough title, muted color.

### 2.6 Empty states

- Illustration or icon (e.g. simple illustration or friendly icon).
- Short headline (e.g. “No tasks for today”).
- Short supporting line.
- One primary CTA (e.g. “Add task”). Use soft gradient or glow for emphasis; keep minimal and friendly.

### 2.7 Feedback

- **Spinner / loading**: small circular indicator, accent color.
- **Error card**: subtle red tint, message text, “Retry” or “Refresh” button.
- **Toast/snackbar** (optional): glass bar at bottom, message + optional action.

---

## 3. Layout

### 3.1 Frames

- **Mobile**: 390×844 (or 375×812). Min height ~700 for scroll.
- **Desktop**: 1280×800 or 1440×900 (Mini App viewport). Max content width ~640–720px centered.

### 3.2 Structure (every screen)

- **Header**: sticky; height ~56–64px; logo, date (desktop), nav (desktop), user + close.
- **Main**: scrollable; padding 16–24; max-width for desktop.
- **Bottom nav (mobile only)**: fixed bottom; height ~56–64px + safe area.

Use **auto-layout** for header, main, and bottom nav; main = fill + scroll if needed.

---

## 4. Screens (and variants)

For each screen, create one frame per **variant** (e.g. state). Use components from §2; keep spacing and typography consistent.

### 4.1 Home (/)

- **Not in Telegram**: date, title “Task tracker”, card “Open in Telegram” + button “Open bot”.
- **Loading**: date, title, spinner + “Signing in with Telegram”.
- **Error**: date, title, error card + “Refresh” button.
- **Connecting**: date, title, card “Connecting…” + “Open tracker” button.
- **Logged in**: date, title, greeting “Hi, {Name}”, “Go to tasks” button, link “Tracker view →”.

### 4.2 Tracker (/tracker)

- **Default**: title “Tracker”, day selector (prev / “Today, Mon, 9 Mar” / next), “0/0”, glass content area with **empty state**: illustration + “No tasks for today” + “Add task” + “All tasks”.
- (Optional) **With tasks**: same header; list of task cards for the day.

### 4.3 Tasks list (/tasks)

- **Empty**: title “Tasks”, “0/0”, empty state + “Add task”.
- **With tasks**: title “Tasks”, “2/5”, list of task cards (checkbox, title, status, due date), “Add task” at bottom.
- **Loading**: title, spinner + “Loading tasks…”.
- **Error**: title, error card + “Refresh”.

### 4.4 New task (/tasks/new)

- **Form**: back button, title “New task”, field “Title” (required), field “Description” (optional), “Add task” button.
- **Loading**: same form, button state “Adding…”.

### 4.5 Recurring (/recurring)

- **Placeholder**: title “Recurring”, glass card “Recurring rules will appear here”.

### 4.6 Reminders (/reminders)

- **Placeholder**: title “Reminders”, glass card “Reminders will appear here”.

### 4.7 Layout variants

- **Desktop**: header with horizontal nav; no bottom nav.
- **Mobile**: header compact (logo + date or logo only); bottom nav with 4 items (Трекер, Задачи, Повторения, Напоминания).

---

## 5. UI states (checklist)

- **Buttons**: default, hover, pressed, disabled, loading.
- **Task card**: default, hover (delete visible), completed (strikethrough + muted).
- **Input**: empty, filled, focus, error.
- **Nav item**: default, active (accent).
- **Empty states**: illustration + copy + CTA for Tracker, Tasks, Recurring, Reminders.
- **Loading**: spinner + short label on Home, Tasks.
- **Error**: card + message + retry/refresh.

---

## 6. Figma file structure (suggested)

1. **Cover** – one frame with app name + short description.
2. **Design system** – page with:
   - Color tokens (dark palette).
   - Typography scale.
   - Spacing & radius.
   - Glass card and button examples.
   - Gradients and glow examples.
3. **Components** – page with all components and their states (buttons, cards, inputs, task item, empty state, nav, spinner, error card).
4. **Layout** – desktop and mobile shell (header, main, bottom nav) with auto-layout.
5. **Screens** – one section per screen; each state = one frame. Name frames clearly (e.g. “Home – Logged in”, “Tasks – Empty”).
6. **Prototype** (optional) – link main flows: Home → Tasks → New task → back to Tasks; Tracker empty state → Add task.

---

## 7. Copy (EN; localize later)

- App name: **Syt**.
- Nav: Tracker, Tasks, Recurring, Reminders.
- Home: “Task tracker”; “Open in Telegram (bot → Open button)”; “Open bot”; “Signing in with Telegram”; “Connecting…”; “Open tracker”; “Hi, {Name}”; “Go to tasks”; “Tracker view →”.
- Tracker: “Tracker”; “Today, Mon, 9 Mar”; “No tasks for today”; “Add task”; “All tasks”.
- Tasks: “Tasks”; “Add task”; “Loading tasks…”; “Something went wrong. Check connection and refresh.”; “Refresh”.
- New task: “New task”; “Title”; “Description (optional)”; “Add task”; “Adding…”.
- Recurring: “Recurring”; “Recurring rules will appear here.”
- Reminders: “Reminders”; “Reminders will appear here.”
- Buttons: “Refresh”, “Open bot”, “Add task”, “All tasks”, “Go to tasks”.

Use this spec to generate or refine the Figma file; keep **auto-layout on** for every component and screen frame.
