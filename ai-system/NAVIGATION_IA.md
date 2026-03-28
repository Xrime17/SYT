# Bottom Navigation & Information Architecture

## Navigation Structure (5 Tabs)

The app now features **5 bottom navigation tabs** in the following order:

1. **Home** (Primary landing tab)
2. **Tracker** (Single-day focus)
3. **Tasks** (All tasks list)
4. **Recurring** (Recurring tasks & habits)
5. **Reminders** (Notifications & reminders)

---

## Home vs Tracker: Key Differences

### 🏠 Home Screen
**Purpose:** Primary daily hub with multi-day overview

**Features:**
- Tasks grouped by time horizon (accordion sections):
  - **Today** (expanded by default)
  - **Tomorrow** (collapsed)
  - **This week** (collapsed)
- Category/habit chips strip at the top
- Shows task count across all time horizons
- Floating Action Button (FAB) to add new tasks
- Best for: Planning across multiple days, getting a bird's-eye view

**Layout:**
- Accordion-based UI for collapsible sections
- Each section shows task count badge
- Empty state when no tasks exist
- 5-item bottom navigation with Home as default active

---

### 📅 Tracker Screen
**Purpose:** Single-day focus with progress tracking

**Features:**
- Focus on **one day at a time** (no accordion, no grouping)
- Date navigation controls (prev/next day buttons)
- Visual day selection with formatted date display
- **Circular progress indicator** showing completion percentage
- Task completion stats (e.g., "2 of 3 completed")
- Tasks sorted by time when available
- Category/habit chips strip
- FAB to add tasks
- Best for: Deep focus on today's tasks, tracking daily progress

**Layout:**
- Flat task list (no sections)
- Progress visualization at top
- Date picker/navigator
- Same 5-item bottom navigation

---

## Design System Alignment

Both screens maintain:
- **Dark theme** with `--syt-*` semantic tokens
- **8px grid system** for spacing
- **Linear/Stripe aesthetic** (minimal, clean, no gradients)
- Mobile-first responsive design (max-width: `screen-sm`)
- Consistent icons at 24px with consistent stroke width
- Badge support in navigation (e.g., unread reminders count)

---

## Usage Recommendations

- **Start on Home** when opening the app → Get daily overview
- **Switch to Tracker** when you want to focus on just today
- **Home** = strategic, multi-horizon planning
- **Tracker** = tactical, single-day execution

---

## Technical Notes

### Bottom Navigation
- Component: `BottomNav` from `/src/app/components/syt/BottomNav.tsx`
- Icons: Lucide React (Home, CalendarDays, ListTodo, Repeat, Bell)
- Icon size: 24px (w-6 h-6)
- Label font: ~11px, semibold when active
- Supports optional badge counts (e.g., `badge: 5`)

### Exported Components
- `HomeScreen` → `/src/app/components/screens/HomeScreen.tsx`
- `TrackerScreen` → `/src/app/components/screens/TrackerScreen.tsx` (updated)

### State Management
Both screens include:
- Task completion toggle
- Reminder bell toggle
- NewTaskForm bottom sheet integration
- Empty state handling
