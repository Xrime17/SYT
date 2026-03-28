# SYT Design System

> A comprehensive, mobile-first UI kit for a task & habit tracker Telegram Mini App

## 📋 Overview

This is a complete design system built for a Telegram Mini App - a task and habit tracker with daily planner functionality. The system features a beautiful dark theme, clean modern aesthetic inspired by Linear and Stripe, and is optimized for mobile-first experiences.

## ✨ What's Included

### 🎨 Design Tokens
- **Semantic color system** with `--syt-*` naming convention
- **Typography scale** (6 levels from xs to 2xl)
- **8px spacing grid** for consistent rhythm
- **Border radius** tokens (sm, md, lg, xl)
- **Ready for light theme** - all tokens use CSS custom properties

### 🧩 Component Library

**15+ Production-Ready Components:**

- ✅ **Button** - 4 variants, 3 sizes, icon support
- ✅ **Input & Textarea** - Labels, validation, helper text
- ✅ **Checkbox & Toggle** - Accessible selection controls
- ✅ **Badges** - Priority, status, frequency, generic
- ✅ **TaskCard** - Complete task display with actions
- ✅ **RecurringCard** - Specialized for recurring tasks
- ✅ **FilterChip** - Active states, removable filters
- ✅ **BottomNav** - Mobile-optimized navigation
- ✅ **AppHeader** - Sticky headers with actions
- ✅ **EmptyState** - Placeholder with CTAs
- ✅ **LoadingState** - Skeletons and spinners

### 📱 Demo Screens

The app includes 4 complete demo sections:

1. **Design System** - Color tokens, typography, spacing, radii
2. **Components** - All components with variants and states
3. **Tasks Demo** - Full task list implementation
4. **Recurring Demo** - Recurring tasks screen

### 📚 Documentation

- **DESIGN_SYSTEM.md** - Complete design system reference
- **QUICKSTART.md** - Quick start guide with code examples
- **README.md** - This file, project overview

## 🚀 Getting Started

### View the Demo

The UI kit is already running in the app. View it to see:
- Complete color palette and design tokens
- All components with variants and states
- Working demo screens
- Mobile-optimized layouts

### Use Components

```tsx
import {
  Button,
  TaskCard,
  AppHeader,
  BottomNav
} from '@/app/components/syt';

function MyScreen() {
  return (
    <>
      <AppHeader title="My Tasks" />
      <TaskCard
        title="Design review"
        priority="high"
        status="active"
      />
      <Button variant="primary">Add Task</Button>
    </>
  );
}
```

## 🎨 Design Principles

1. **Mobile-First** - Optimized for Telegram's webview
2. **Dark Theme Primary** - Beautiful dark aesthetic
3. **8px Grid System** - Consistent spacing
4. **Minimalist & Modern** - Linear/Stripe-inspired
5. **Accessible** - WCAG-compliant colors
6. **Token-Based** - Easy theming and customization

## 📂 Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main demo/showcase app
│   └── components/
│       └── syt/                   # SYT Design System
│           ├── index.ts           # Main export
│           ├── Button.tsx
│           ├── Input.tsx
│           ├── Checkbox.tsx
│           ├── Badge.tsx
│           ├── TaskCard.tsx
│           ├── FilterChip.tsx
│           ├── BottomNav.tsx
│           ├── AppHeader.tsx
│           ├── EmptyState.tsx
│           └── LoadingState.tsx
├── styles/
│   ├── theme.css                  # Design tokens
│   ├── utilities.css              # Helper classes
│   └── index.css                  # Main styles
└── main.tsx                       # App entry point

docs/
├── DESIGN_SYSTEM.md               # Full design system docs
├── QUICKSTART.md                  # Quick start guide
└── README.md                      # This file
```

## 🎯 Key Features

### Color System
- Surface layers: background → surface → card
- Semantic colors: accent, success, warning, error
- Text hierarchy: text → secondary → muted
- Priority colors for task management

### Typography
- 6-level scale for clear hierarchy
- Optimized for mobile readability
- System font stack for native feel
- Proper line heights and letter spacing

### Spacing
- Strict 8px grid system
- 6 spacing tokens (8px to 48px)
- Consistent padding and margins
- Predictable visual rhythm

### Interactions
- Smooth transitions (200ms)
- Active state scaling (0.98)
- Hover states for desktop
- Touch-friendly tap targets (44px min)

## 🌓 Theme Support

The system is built for dark theme but ready for light theme:

```css
/* Dark theme (default) */
:root {
  --syt-background: #0A0A0B;
  --syt-text: #F9FAFB;
  /* ... */
}

/* Light theme (ready to use) */
.light {
  --syt-background: #FFFFFF;
  --syt-text: #111827;
  /* ... */
}
```

## 📱 Mobile Optimization

- **Safe area insets** for iOS notches
- **Bottom navigation** in thumb zone
- **Sticky headers** for context
- **Horizontal scroll** for filters
- **Touch-friendly** tap targets
- **Smooth scrolling** for lists

## 🔧 Customization

All components accept `className` prop for custom styling:

```tsx
<Button
  variant="primary"
  className="w-full shadow-xl"
>
  Custom Button
</Button>
```

Modify design tokens in `src/styles/theme.css` to rebrand:

```css
:root {
  --syt-accent: #6366F1;  /* Change brand color */
  --radius-lg: 1rem;       /* Adjust roundness */
}
```

## 🎬 Demo Sections

### 1. Design System Tab
View the complete design foundation:
- Color palette with values
- Typography hierarchy
- Spacing scale visualization
- Border radius examples

### 2. Components Tab
Explore all components:
- Buttons (variants, sizes, states)
- Inputs (with icons, validation)
- Checkboxes & toggles
- Badges (priority, status, frequency)
- Filter chips (active/inactive)
- Loading skeletons
- Empty states

### 3. Tasks Demo
See the system in action:
- Task list with cards
- Priority and status badges
- Due dates
- Complete/edit/delete actions
- Filter chips
- Empty states

### 4. Recurring Tab
Recurring tasks pattern:
- Recurring task cards
- Frequency badges
- Next due dates
- Completion tracking

## 💡 Usage Tips

1. **Follow the 8px grid** - Use multiples of 8px for spacing
2. **Use semantic tokens** - Prefer `text-syt-text` over `text-gray-100`
3. **Test on mobile** - The system is mobile-first
4. **Show loading states** - Use skeletons for better UX
5. **Consistent radius** - Use token-based border radius

## 📖 Documentation

- **[Design System Guide](./DESIGN_SYSTEM.md)** - Complete reference
- **[Quick Start](./QUICKSTART.md)** - Code examples and patterns
- **Component Props** - Check TypeScript definitions in each component file

## 🎨 Design System Highlights

### Modern Dark Theme
- Deep blacks with subtle grays
- Indigo accent (#6366F1)
- Proper contrast ratios
- Subtle glows for emphasis

### Component States
- Default, hover, active, disabled
- Focus rings for accessibility
- Smooth transitions
- Loading skeletons

### Layout Patterns
- Sticky headers
- Bottom navigation
- Card-based layouts
- Filter chips
- Empty states

## 🚀 Build & Deploy

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Output in dist/
```

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## ✅ Browser Support

- Modern mobile browsers (iOS Safari, Chrome)
- Telegram webview
- Supports dark mode via CSS custom properties

## 🎯 Next Steps

1. **Explore the demo** - Run the app to see all components
2. **Read the docs** - Check DESIGN_SYSTEM.md and QUICKSTART.md
3. **Build screens** - Use the components to create your app
4. **Customize** - Adjust tokens to match your brand

## 📝 License

This design system was created for a Telegram Mini App project.

---

**Built with ❤️ for mobile-first experiences**

For questions or issues, refer to the documentation files or explore the component source code.
