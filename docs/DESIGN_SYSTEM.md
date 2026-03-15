# Syt design system

Reusable dark-theme design system for the Syt Telegram Mini App. Tokens are in CSS variables; components use them and support hover, active, disabled, and loading states where relevant.

## Tokens (CSS variables)

Use when building custom UI. In dark theme (`.dark` or `[data-theme="dark"]`) the values below apply.

| Token | Light | Dark |
|-------|--------|------|
| `--syt-background` | #f8fafc | #0F1117 |
| `--syt-surface` | #ffffff | #161B22 |
| `--syt-card` | #ffffff | #1C2128 |
| `--syt-border` | #e2e8f0 | #2A2F37 |
| `--syt-accent` | #6366f1 | #6366F1 |
| `--syt-accent-glow` | #818cf8 | #818CF8 |
| `--syt-success` | #22c55e | #22C55E |
| `--syt-warning` | #f59e0b | #F59E0B |
| `--syt-error` | #ef4444 | #EF4444 |
| `--syt-text` | #0f172a | #F3F4F6 |
| `--syt-text-secondary` | #64748b | #9CA3AF |
| `--syt-text-muted` | #94a3b8 | #6B7280 |
| `--syt-space-1` … `--syt-space-6` | 8px … 48px (8px grid) |
| `--syt-radius-card` | 14px |
| `--syt-radius-button` | 12px |
| `--syt-radius-input` | 10px |
| `--syt-shadow-soft` | 0 10px 25px rgba(0,0,0,0.12) | 0 10px 25px rgba(0,0,0,0.35) |
| `--syt-glass-bg` | rgba(255,255,255,0.7) | rgba(255,255,255,0.05) |
| `--syt-glass-border` | rgba(255,255,255,0.5) | rgba(255,255,255,0.08) |
| `--syt-glass-blur` | 12px | 20px |

**Typography:** Inter (400 body, 600 headings). Loaded via `next/font/google` in `_app.tsx`.

## Glass card utility

Class `.syt-glass-card`: background, backdrop blur, border, radius, shadow from tokens.

## Components

Import from `@/components` or `@/components/design-system`.

| Component | Description | Variants / states |
|-----------|-------------|-------------------|
| **Button** | Primary, Secondary, Ghost, Danger | hover, active, disabled, loading |
| **Input** | Text field | label, error, disabled, focus |
| **Textarea** | Multi-line input | label, error, disabled, focus |
| **Checkbox** | Controlled checkbox | checked, disabled |
| **Card** | Glass container | — |
| **TaskCard** | Task row with checkbox, title, meta, delete | completed (strikethrough), hover (delete visible) |
| **EmptyStateCard** | Icon + title + description + CTA | — |
| **ErrorCard** | Title + message + optional retry button | — |
| **Spinner** | Loading indicator | — |
| **Avatar** | Initial or image | sm, md, lg |
| **NavTabs** | Horizontal tab links | active |
| **BottomNav** | Bottom bar with icon + label links | active |
| **PriorityBadge** | LOW, MEDIUM, HIGH | — |
| **StatusBadge** | ACTIVE, COMPLETED, ARCHIVED | — |

## Usage

```tsx
import { Button, Card, Input, TaskCard, EmptyStateCard, PriorityBadge, StatusBadge } from '@/components/design-system';

<Button variant="primary" loading={isLoading}>Save</Button>
<Button variant="danger" onClick={onDelete}>Delete</Button>

<Card>
  <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} />
</Card>

<TaskCard
  title="Task title"
  status="ACTIVE"
  priority="HIGH"
  completed={false}
  onToggle={() => {}}
  onDelete={() => {}}
/>

<EmptyStateCard
  icon="🦆"
  title="No tasks for today"
  description="Add a task to get started."
  actionLabel="Add task"
  onAction={() => {}}
/>
```
