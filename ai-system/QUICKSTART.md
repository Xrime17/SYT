# SYT Design System - Quick Start Guide

Get started with the SYT design system in minutes.

## 🚀 Installation

The design system is already integrated into your project. All components are available in the `src/app/components/syt` directory.

## 📖 Basic Usage

### 1. Import Components

```tsx
// Import individual components
import { Button, TaskCard, AppHeader } from '@/app/components/syt';

// Or import from individual files
import { Button } from '@/app/components/syt/Button';
```

### 2. Use Design Tokens

All design tokens are available as Tailwind CSS classes:

```tsx
// Colors
<div className="bg-syt-background text-syt-text" />
<div className="bg-syt-card border-syt-border" />
<div className="text-syt-text-secondary" />

// Direct CSS custom properties
<div style={{ backgroundColor: 'var(--syt-accent)' }} />
```

### 3. Build Your First Screen

Here's a complete example of a task list screen:

```tsx
import { useState } from 'react';
import {
  AppHeader,
  Button,
  TaskCard,
  FilterChip,
  FilterGroup,
  BottomNav,
  EmptyState
} from '@/app/components/syt';
import { Plus, ListTodo, Repeat, Bell, Calendar } from 'lucide-react';

function TasksScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Design review meeting',
      description: 'Prepare presentation slides',
      priority: 'high',
      status: 'active',
      dueDate: 'Today, 2:00 PM',
      completed: false
    }
  ]);

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  return (
    <div className="min-h-screen bg-syt-background pb-20">
      {/* Header */}
      <AppHeader
        title="Today's Tasks"
        subtitle={`${tasks.length} tasks`}
        action={
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>
            Add
          </Button>
        }
      />

      {/* Filters */}
      <div className="px-4 py-3 border-b border-syt-border">
        <FilterGroup>
          <FilterChip
            label="All"
            active={activeFilter === 'all'}
            onToggle={() => setActiveFilter('all')}
          />
          <FilterChip
            label="Today"
            active={activeFilter === 'today'}
            onToggle={() => setActiveFilter('today')}
            icon={<Calendar className="w-3 h-3" />}
          />
          <FilterChip
            label="High Priority"
            active={activeFilter === 'high'}
            onToggle={() => setActiveFilter('high')}
          />
        </FilterGroup>
      </div>

      {/* Task List */}
      <div className="px-4 py-4 space-y-3">
        {tasks.length === 0 ? (
          <EmptyState
            icon={<ListTodo className="w-12 h-12" />}
            title="No tasks yet"
            description="Create your first task to get started"
            primaryAction={{
              label: 'Add Task',
              onClick: () => {},
              icon: <Plus className="w-4 h-4" />
            }}
          />
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              dueDate={task.dueDate}
              completed={task.completed}
              onToggleComplete={() => handleToggleComplete(task.id)}
              onEdit={() => console.log('Edit', task.id)}
              onDelete={() => console.log('Delete', task.id)}
            />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        items={[
          { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-5 h-5" />, badge: 5 },
          { id: 'recurring', label: 'Recurring', icon: <Repeat className="w-5 h-5" /> },
          { id: 'reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> }
        ]}
        activeId="tasks"
        onItemClick={(id) => console.log('Navigate to', id)}
      />
    </div>
  );
}
```

## 🎨 Common Patterns

### Form with Validation

```tsx
import { useState } from 'react';
import { Input, Textarea, Button, AppHeader } from '@/app/components/syt';
import { ArrowLeft } from 'lucide-react';

function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Task name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form
    console.log({ title, description });
  };

  return (
    <div className="min-h-screen bg-syt-background">
      <AppHeader
        title="New Task"
        backButton={
          <button className="p-2 text-syt-text-muted hover:text-syt-text">
            <ArrowLeft className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-4 py-6 space-y-4">
        <Input
          label="Task Name"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        <Textarea
          label="Description"
          placeholder="Add details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <Button
          variant="primary"
          className="w-full"
          onClick={handleSubmit}
        >
          Create Task
        </Button>
      </div>
    </div>
  );
}
```

### Settings Screen with Toggles

```tsx
import { useState } from 'react';
import { AppHeader, Toggle } from '@/app/components/syt';

function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  return (
    <div className="min-h-screen bg-syt-background">
      <AppHeader title="Settings" />

      <div className="px-4 py-6">
        <div className="bg-syt-card border border-syt-border rounded-xl divide-y divide-syt-border">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h4>Push Notifications</h4>
              <p className="text-sm text-syt-text-secondary">
                Get notified about task reminders
              </p>
            </div>
            <Toggle
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <h4>Sound Effects</h4>
              <p className="text-sm text-syt-text-secondary">
                Play sounds for actions
              </p>
            </div>
            <Toggle
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Loading States

```tsx
import { useState, useEffect } from 'react';
import { TaskCard, LoadingState, TaskCardSkeleton } from '@/app/components/syt';

function TaskList() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks([/* ... */]);
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Use the 8px Grid

Always use spacing that's a multiple of 8px:

```tsx
// ✅ Good
<div className="p-4 space-y-3 mb-6" />  // 16px, 12px, 24px

// ❌ Avoid
<div className="p-3 space-y-5 mb-7" />  // 12px, 20px, 28px (breaks grid)
```

### 2. Consistent Border Radius

Use the predefined radius tokens:

```tsx
// ✅ Good
<div className="rounded-lg" />  // Uses --radius-lg

// ❌ Avoid
<div className="rounded-[13px]" />  // Custom, inconsistent value
```

### 3. Semantic Colors

Use semantic color tokens instead of specific shades:

```tsx
// ✅ Good
<div className="text-syt-text-secondary" />
<div className="bg-syt-error" />

// ❌ Avoid
<div className="text-gray-400" />
<div className="bg-red-500" />
```

### 4. Mobile Touch Targets

Ensure interactive elements are at least 44px for easy tapping:

```tsx
// ✅ Good
<Button size="md">Tap Me</Button>  // 40px height, within range

// ⚠️ Caution
<button className="h-6 w-6">×</button>  // Too small for mobile
```

### 5. Loading States

Always show loading states for async operations:

```tsx
// ✅ Good
{loading ? <TaskCardSkeleton /> : <TaskCard {...task} />}

// ❌ Avoid
{loading ? null : <TaskCard {...task} />}  // Empty screen confusing
```

## 📱 Mobile-Specific Tips

### Safe Area Insets

For full-screen apps, respect device safe areas:

```tsx
<div className="pb-20 safe-area-inset-bottom">
  {/* Content */}
</div>
```

### Horizontal Scrolling

For filter chips or horizontal lists:

```tsx
<FilterGroup className="overflow-x-auto scrollbar-hide">
  {/* Chips */}
</FilterGroup>
```

### Sticky Headers

Keep context visible while scrolling:

```tsx
<AppHeader className="sticky top-0 z-40" />
```

## 🔧 Customization

### Extending Components

You can extend any component with additional styles:

```tsx
<Button
  variant="primary"
  className="w-full shadow-2xl"  // Additional classes
>
  Custom Button
</Button>
```

### Creating Custom Variants

Use the design tokens to create consistent custom components:

```tsx
function CustomCard({ children }) {
  return (
    <div className="bg-syt-card border border-syt-border rounded-xl p-4 hover:border-syt-accent/30 transition-all">
      {children}
    </div>
  );
}
```

## 🎨 Color Reference

Quick reference for common color combinations:

```tsx
// Primary action
<button className="bg-syt-accent text-white">Action</button>

// Secondary surface
<div className="bg-syt-surface border border-syt-border">Card</div>

// Success state
<div className="bg-syt-success-subtle text-syt-success">✓ Done</div>

// Warning state
<div className="bg-syt-warning-subtle text-syt-warning">⚠ Warning</div>

// Error state
<div className="bg-syt-error-subtle text-syt-error">✗ Error</div>
```

## 📚 Next Steps

1. Explore the full component library in `App.tsx`
2. Read the comprehensive [Design System Documentation](./DESIGN_SYSTEM.md)
3. Build your first screen using the patterns above
4. Customize the theme tokens for your brand

## 💡 Tips

- Use the demo app (`App.tsx`) as a living style guide
- Keep the design tokens file open for reference
- Test on real mobile devices early and often
- Follow the 8px grid religiously for visual consistency

---

Need help? Check the component props in the TypeScript definitions or explore the demo screens in `App.tsx`.
