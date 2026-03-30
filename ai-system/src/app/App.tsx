import { useState } from "react";
import {
  CheckCircle2,
  ListTodo,
  Repeat,
  Bell,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Flag,
  MoreHorizontal,
  ClipboardList,
  Zap,
  BarChart3,
  Settings as SettingsIcon,
  Layers,
  Palette,
  Grid3x3,
  FileText,
  Home,
  CalendarDays,
} from "lucide-react";

// UI Kit Components - Basic
import { Button } from "./components/syt/Button";
import { Input, Textarea } from "./components/syt/Input";
import { Checkbox, Toggle } from "./components/syt/Checkbox";
import {
  Badge,
  PriorityBadge,
  StatusBadge,
  FrequencyBadge,
} from "./components/syt/Badge";
import {
  TaskCard,
  RecurringCard,
} from "./components/syt/TaskCard";
import {
  FilterChip,
  FilterGroup,
} from "./components/syt/FilterChip";
import { BottomNav } from "./components/syt/BottomNav";
import { ProductBottomNav } from "./components/syt/ProductBottomNav";
import { AppHeader } from "./components/syt/AppHeader";
import { EmptyState } from "./components/syt/EmptyState";
import {
  LoadingState,
  TaskCardSkeleton,
} from "./components/syt/LoadingState";

// UI Kit Components - Advanced
import { Modal, BottomSheet } from "./components/syt/Modal";
import { Tabs } from "./components/syt/Tabs";
import { SegmentedControl } from "./components/syt/SegmentedControl";
import { FloatingActionButton } from "./components/syt/FloatingActionButton";
import { Toaster, toast } from "./components/syt/Toast";
import { Alert } from "./components/syt/Alert";
import { ConfirmDialog } from "./components/syt/ConfirmDialog";
import {
  ProgressBar,
  CircularProgress,
  StreakIndicator,
  CompletionStats,
} from "./components/syt/Progress";
import {
  SwipeActions,
  TaskSwipeActions,
} from "./components/syt/SwipeActions";
import { CalendarStrip } from "./components/syt/CalendarStrip";
import { Divider } from "./components/syt/Divider";
import { DragHandle } from "./components/syt/DragHandle";
import { TaskListItem } from "./components/syt/TaskListItem";
import { Icons } from "./components/syt/Icons";

// Screens
import { TaskDetailsScreen } from "./components/screens/TaskDetailsScreen";
import { CreateTaskScreen } from "./components/screens/CreateTaskScreen";
import { StatsScreen } from "./components/screens/StatsScreen";
import { HomeScreen } from "./components/screens/HomeScreen";
import { TrackerScreen } from "./components/screens/TrackerScreen";
import { NewTaskForm } from "./components/screens/NewTaskForm";

export default function App() {
  const [activeTab, setActiveTab] = useState("design-system");
  const [selectedFilter, setSelectedFilter] = useState<
    string[]
  >(["high"]);
  const [showModal, setShowModal] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] =
    useState(false);
  const [showScreen, setShowScreen] = useState<string | null>(
    null,
  );
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  // Demo sections (UI Kit shell)
  const sections = [
    {
      id: "design-system",
      label: "Tokens",
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: "components",
      label: "Basic",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: "screens",
      label: "Screens",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
    },
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilter((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  // ── Other full-screen demos ────────────────────────────────────────────────
  if (showScreen === "task-details") {
    return (
      <TaskDetailsScreen onBack={() => setShowScreen(null)} />
    );
  }
  if (showScreen === "create-task") {
    return (
      <CreateTaskScreen onBack={() => setShowScreen(null)} />
    );
  }
  if (showScreen === "stats") {
    return <StatsScreen />;
  }

  // ── Home Screen removed from here - now rendered inside main container ─────

  return (
    <div className="min-h-screen bg-syt-background pb-20">
      <Toaster />

      <AppHeader
        title="SYT UI Kit"
        subtitle="Task & Habit Tracker Design System"
        action={
          <button className="p-2 text-syt-text-muted hover:text-syt-text rounded-lg hover:bg-syt-surface transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        }
      />

      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-8">
        {/* Design System Tab */}
        {activeTab === "design-system" && (
          <>
            {/* Color Tokens */}
            <section>
              <h2 className="mb-4">Base Colors</h2>
              <div className="grid grid-cols-2 gap-3">
                <ColorSwatch
                  name="Background"
                  value="var(--syt-background)"
                />
                <ColorSwatch
                  name="Surface"
                  value="var(--syt-surface)"
                />
                <ColorSwatch
                  name="Card"
                  value="var(--syt-card)"
                />
                <ColorSwatch
                  name="Border"
                  value="var(--syt-border)"
                />
                <ColorSwatch
                  name="Accent"
                  value="var(--syt-accent)"
                />
                <ColorSwatch
                  name="Success"
                  value="var(--syt-success)"
                />
                <ColorSwatch
                  name="Warning"
                  value="var(--syt-warning)"
                />
                <ColorSwatch
                  name="Error"
                  value="var(--syt-error)"
                />
                <ColorSwatch
                  name="Text"
                  value="var(--syt-text)"
                />
                <ColorSwatch
                  name="Text Secondary"
                  value="var(--syt-text-secondary)"
                />
              </div>
            </section>

            {/* Elevation Levels */}
            <section>
              <h2 className="mb-4">Elevation Levels</h2>
              <div className="grid grid-cols-2 gap-3">
                <ColorSwatch
                  name="Surface 1"
                  value="var(--syt-surface-1)"
                />
                <ColorSwatch
                  name="Surface 2"
                  value="var(--syt-surface-2)"
                />
                <ColorSwatch
                  name="Surface 3"
                  value="var(--syt-surface-3)"
                />
                <ColorSwatch
                  name="Overlay"
                  value="var(--syt-overlay)"
                />
              </div>
            </section>

            {/* Dividers */}
            <section>
              <h2 className="mb-4">Dividers</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-4">
                <div>
                  <p className="text-xs text-syt-text-muted mb-2">
                    Subtle
                  </p>
                  <Divider variant="subtle" />
                </div>
                <div>
                  <p className="text-xs text-syt-text-muted mb-2">
                    Default
                  </p>
                  <Divider variant="default" />
                </div>
                <div>
                  <p className="text-xs text-syt-text-muted mb-2">
                    Strong
                  </p>
                  <Divider variant="strong" />
                </div>
                <div>
                  <p className="text-xs text-syt-text-muted mb-2">
                    With Label
                  </p>
                  <Divider variant="default" label="Section" />
                </div>
              </div>
            </section>

            {/* Overlays & Backdrops */}
            <section>
              <h2 className="mb-4">Overlays & Backdrops</h2>
              <div className="grid grid-cols-2 gap-3">
                <ColorSwatch
                  name="Backdrop"
                  value="var(--syt-backdrop)"
                />
                <ColorSwatch
                  name="Backdrop Blur"
                  value="var(--syt-backdrop-blur)"
                />
              </div>
            </section>

            {/* Focus States */}
            <section>
              <h2 className="mb-4">Focus States</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-3">
                <button className="px-4 py-2 bg-syt-surface border border-syt-border rounded-lg focus:outline-none focus:ring-2 focus:ring-syt-focus-ring">
                  Focus me
                </button>
                <input
                  type="text"
                  placeholder="Focus me"
                  className="w-full px-4 py-2 bg-syt-surface border border-syt-border rounded-lg focus:outline-none focus:ring-2 focus:ring-syt-focus-ring"
                />
              </div>
            </section>

            {/* Disabled States */}
            <section>
              <h2 className="mb-4">Disabled States</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-3">
                <Button disabled>Disabled Button</Button>
                <input
                  type="text"
                  placeholder="Disabled input"
                  disabled
                  className="w-full px-4 py-2 bg-syt-disabled-bg border border-syt-disabled-border text-syt-disabled-text rounded-lg cursor-not-allowed"
                />
              </div>
            </section>

            {/* Typography */}
            <section>
              <h2 className="mb-4">Typography</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-3">
                <h1>Large Title (H1)</h1>
                <h2>Section Title (H2)</h2>
                <h3>Subsection (H3)</h3>
                <h4>Card Title (H4)</h4>
                <p>
                  Body text with good readability and
                  appropriate line height for mobile screens.
                </p>
                <small className="block text-syt-text-muted">
                  Caption text for timestamps and metadata
                </small>
              </div>
            </section>

            {/* Spacing */}
            <section>
              <h2 className="mb-4">Spacing (8px Grid)</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-syt-accent rounded" />
                  <span className="text-sm text-syt-text-secondary">
                    8px (0.5rem)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-syt-accent rounded" />
                  <span className="text-sm text-syt-text-secondary">
                    16px (1rem)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-syt-accent rounded" />
                  <span className="text-sm text-syt-text-secondary">
                    24px (1.5rem)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-syt-accent rounded" />
                  <span className="text-sm text-syt-text-secondary">
                    32px (2rem)
                  </span>
                </div>
              </div>
            </section>

            {/* Border Radius */}
            <section>
              <h2 className="mb-4">Border Radius</h2>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="bg-syt-card border border-syt-border p-4"
                  style={{ borderRadius: "var(--radius-sm)" }}
                >
                  <p className="text-xs text-syt-text-muted">
                    Small (6px)
                  </p>
                </div>
                <div
                  className="bg-syt-card border border-syt-border p-4"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <p className="text-xs text-syt-text-muted">
                    Medium (8px)
                  </p>
                </div>
                <div
                  className="bg-syt-card border border-syt-border p-4"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <p className="text-xs text-syt-text-muted">
                    Large (12px)
                  </p>
                </div>
                <div
                  className="bg-syt-card border border-syt-border p-4"
                  style={{ borderRadius: "var(--radius-xl)" }}
                >
                  <p className="text-xs text-syt-text-muted">
                    X-Large (16px)
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Components Tab */}
        {activeTab === "components" && (
          <>
            {/* Buttons */}
            <section>
              <h2 className="mb-4">Buttons</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    Variants
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">
                      Secondary
                    </Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">
                      Destructive
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    Sizes
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    With Icons
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button icon={<Plus className="w-4 h-4" />}>
                      Add Task
                    </Button>
                    <Button
                      variant="secondary"
                      icon={<Search className="w-4 h-4" />}
                    >
                      Search
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    States
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Inputs */}
            <section>
              <h2 className="mb-4">Inputs</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-4">
                <Input
                  label="Task Name"
                  placeholder="Enter task name..."
                />
                <Input
                  label="Search"
                  placeholder="Search tasks..."
                  icon={<Search className="w-4 h-4" />}
                />
                <Input
                  label="With Error"
                  placeholder="example@email.com"
                  error="This field is required"
                />
                <Textarea
                  label="Description"
                  placeholder="Add task description..."
                  rows={3}
                />
              </div>
            </section>

            {/* Checkboxes & Toggles */}
            <section>
              <h2 className="mb-4">Checkboxes & Toggles</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <Checkbox
                    label="Task completed"
                    checked={false}
                  />
                  <Checkbox
                    label="Task completed"
                    checked={true}
                  />
                </div>
                <div className="border-t border-syt-border pt-4 space-y-2">
                  <Toggle
                    label="Enable notifications"
                    checked={false}
                  />
                  <Toggle
                    label="Enable notifications"
                    checked={true}
                  />
                </div>
              </div>
            </section>

            {/* Badges */}
            <section>
              <h2 className="mb-4">Badges & Pills</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    Priority
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <PriorityBadge priority="low" />
                    <PriorityBadge priority="medium" />
                    <PriorityBadge priority="high" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="active" />
                    <StatusBadge status="done" />
                    <StatusBadge status="overdue" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    Frequency
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <FrequencyBadge frequency="daily" />
                    <FrequencyBadge frequency="weekly" />
                    <FrequencyBadge frequency="monthly" />
                    <FrequencyBadge frequency="custom" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-syt-text-muted mb-2">
                    Generic
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="accent">Accent</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Chips */}
            <section>
              <h2 className="mb-4">Filter Chips</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4">
                <FilterGroup>
                  <FilterChip
                    label="All"
                    active={selectedFilter.includes("all")}
                    onToggle={() => toggleFilter("all")}
                  />
                  <FilterChip
                    label="High Priority"
                    active={selectedFilter.includes("high")}
                    onToggle={() => toggleFilter("high")}
                    onRemove={() => toggleFilter("high")}
                    icon={<Flag className="w-3 h-3" />}
                  />
                  <FilterChip
                    label="Today"
                    active={selectedFilter.includes("today")}
                    onToggle={() => toggleFilter("today")}
                    icon={<Calendar className="w-3 h-3" />}
                  />
                  <FilterChip
                    label="Overdue"
                    active={selectedFilter.includes("overdue")}
                    onToggle={() => toggleFilter("overdue")}
                  />
                </FilterGroup>
              </div>
            </section>

            {/* States */}
            <section>
              <h2 className="mb-4">States</h2>
              <div className="space-y-4">
                <div className="bg-syt-card border border-syt-border rounded-xl p-4">
                  <p className="text-sm text-syt-text-muted mb-3">
                    Loading Skeleton
                  </p>
                  <TaskCardSkeleton />
                </div>
                <div className="bg-syt-card border border-syt-border rounded-xl">
                  <EmptyState
                    icon={
                      <CheckCircle2 className="w-12 h-12" />
                    }
                    title="No tasks for today"
                    description="You're all caught up! Add a new task or view all tasks."
                    primaryAction={{
                      label: "Add Task",
                      onClick: () => {},
                      icon: <Plus className="w-4 h-4" />,
                    }}
                    secondaryAction={{
                      label: "View All",
                      onClick: () => {},
                    }}
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Tasks Demo */}
        {activeTab === "tasks" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2>Today's Tasks</h2>
              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </div>

            <FilterGroup className="mb-4">
              <FilterChip label="All" active />
              <FilterChip
                label="High Priority"
                icon={<Flag className="w-3 h-3" />}
              />
              <FilterChip
                label="Today"
                icon={<Calendar className="w-3 h-3" />}
              />
            </FilterGroup>

            <div className="space-y-3">
              <TaskCard
                title="Design review meeting"
                description="Prepare presentation slides and gather feedback from the team"
                priority="high"
                status="active"
                dueDate="Today, 2:00 PM"
                completed={false}
                onToggleComplete={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
              <TaskCard
                title="Update documentation"
                description="Add new API endpoints to the developer docs"
                priority="medium"
                status="active"
                dueDate="Tomorrow"
                completed={false}
                onToggleComplete={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
              <TaskCard
                title="Code review for PR #234"
                priority="low"
                status="done"
                dueDate="Yesterday"
                completed={true}
                onToggleComplete={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
              <TaskCard
                title="Submit monthly report"
                description="Financial report due by end of day"
                priority="high"
                status="overdue"
                dueDate="2 days ago"
                completed={false}
                onToggleComplete={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          </>
        )}

        {/* Advanced Components Tab */}
        {activeTab === "advanced" && (
          <>
            {/* Modals & Dialogs */}
            <section>
              <h2 className="mb-4">Modals & Dialogs</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-3">
                <Button
                  onClick={() => setShowModal(true)}
                  className="w-full"
                >
                  Open Modal
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowBottomSheet(true)}
                  className="w-full"
                >
                  Open Bottom Sheet
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirmDialog(true)}
                  className="w-full"
                >
                  Open Confirm Dialog
                </Button>
              </div>
            </section>

            {/* Tabs */}
            <section>
              <h2 className="mb-4">Tabs</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-syt-text-muted mb-2">
                    Default
                  </p>
                  <Tabs
                    variant="default"
                    items={[
                      { value: "all", label: "All" },
                      {
                        value: "active",
                        label: "Active",
                        badge: 3,
                      },
                      { value: "done", label: "Done" },
                    ]}
                  />
                </div>
                <div>
                  <p className="text-sm text-syt-text-muted mb-2">
                    Pills
                  </p>
                  <Tabs
                    variant="pills"
                    items={[
                      {
                        value: "all",
                        label: "All",
                        icon: <ListTodo className="w-4 h-4" />,
                      },
                      {
                        value: "tasks",
                        label: "Tasks",
                        icon: (
                          <CheckCircle2 className="w-4 h-4" />
                        ),
                      },
                      {
                        value: "recurring",
                        label: "Recurring",
                        icon: <Repeat className="w-4 h-4" />,
                      },
                    ]}
                  />
                </div>
                <div>
                  <p className="text-sm text-syt-text-muted mb-2">
                    Underline
                  </p>
                  <Tabs
                    variant="underline"
                    items={[
                      { value: "overview", label: "Overview" },
                      { value: "details", label: "Details" },
                      { value: "activity", label: "Activity" },
                    ]}
                  />
                </div>
              </div>
            </section>

            {/* Segmented Control */}
            <section>
              <h2 className="mb-4">Segmented Control</h2>
              <div className="space-y-4">
                <SegmentedControl
                  items={[
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                  ]}
                />
                <SegmentedControl
                  fullWidth
                  items={[
                    { value: "low", label: "Low" },
                    { value: "medium", label: "Medium" },
                    { value: "high", label: "High" },
                  ]}
                />
              </div>
            </section>

            {/* Progress Indicators */}
            <section>
              <h2 className="mb-4">Progress & Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-syt-text-muted mb-2">
                    Progress Bar
                  </p>
                  <ProgressBar
                    value={65}
                    max={100}
                    variant="accent"
                  />
                </div>
                <div className="flex items-center justify-around">
                  <CircularProgress
                    value={75}
                    size={80}
                    variant="accent"
                  />
                  <CircularProgress
                    value={50}
                    size={80}
                    variant="success"
                  />
                  <CircularProgress
                    value={25}
                    size={80}
                    variant="warning"
                  />
                </div>
                <StreakIndicator days={7} variant="fire" />
                <CompletionStats completed={18} total={25} />
              </div>
            </section>

            {/* Alerts */}
            <section>
              <h2 className="mb-4">Alerts</h2>
              <div className="space-y-3">
                <Alert
                  variant="info"
                  title="Info"
                  description="This is an informational alert."
                />
                <Alert
                  variant="success"
                  title="Success"
                  description="Task completed successfully!"
                />
                <Alert
                  variant="warning"
                  title="Warning"
                  description="Due date is approaching."
                />
                <Alert
                  variant="error"
                  title="Error"
                  description="Failed to save changes."
                />
              </div>
            </section>

            {/* Toast Demos */}
            <section>
              <h2 className="mb-4">Toasts</h2>
              <div className="bg-syt-card border border-syt-border rounded-xl p-4 space-y-3">
                <Button
                  onClick={() =>
                    toast.success("Task completed!")
                  }
                  className="w-full"
                  variant="secondary"
                >
                  Show Success Toast
                </Button>
                <Button
                  onClick={() =>
                    toast.error("Failed to delete task")
                  }
                  className="w-full"
                  variant="secondary"
                >
                  Show Error Toast
                </Button>
                <Button
                  onClick={() =>
                    toast.warning("Due date is tomorrow")
                  }
                  className="w-full"
                  variant="secondary"
                >
                  Show Warning Toast
                </Button>
                <Button
                  onClick={() => toast.info("Reminder set")}
                  className="w-full"
                  variant="secondary"
                >
                  Show Info Toast
                </Button>
              </div>
            </section>

            {/* Calendar Strip */}
            <section>
              <h2 className="mb-4">Calendar Strip</h2>
              <CalendarStrip
                highlightedDates={[
                  new Date(),
                  new Date(Date.now() + 86400000),
                ]}
                completedDates={[
                  new Date(Date.now() - 86400000),
                ]}
              />
            </section>

            {/* Task List Items */}
            <section>
              <h2 className="mb-4">Task List Items</h2>
              <div className="space-y-3">
                <TaskListItem
                  title="Compact task item"
                  dueDate="Today"
                  priority="high"
                  status="active"
                />
                <TaskListItem
                  title="Expandable task with details"
                  description="This task has a description and tags that can be revealed by clicking the expand button."
                  dueDate="Tomorrow"
                  priority="medium"
                  tags={["Work", "Design", "Urgent"]}
                  expandable
                />
                <TaskListItem
                  title="Draggable task"
                  dueDate="Next week"
                  priority="low"
                  draggable
                />
              </div>
            </section>

            {/* Swipe Actions */}
            <section>
              <h2 className="mb-4">Swipe Actions</h2>
              <p className="text-sm text-syt-text-secondary mb-3">
                Swipe left or right on the task
              </p>
              <TaskSwipeActions
                onComplete={() =>
                  toast.success("Task completed!")
                }
                onDelete={() => toast.error("Task deleted")}
              >
                <TaskCard
                  title="Swipe me left or right"
                  description="Try swiping this task"
                  priority="medium"
                  dueDate="Today"
                  onToggleComplete={() => {}}
                />
              </TaskSwipeActions>
            </section>

            {/* FAB */}
            <section>
              <h2 className="mb-4">Floating Action Button</h2>
              <p className="text-sm text-syt-text-secondary mb-3">
                FAB is positioned at the bottom right (check the
                corner)
              </p>
            </section>

            {/* Icon System */}
            <section>
              <h2 className="mb-4">Icon System</h2>
              <div className="grid grid-cols-5 gap-4">
                {[
                  {
                    Icon: Icons.navigation.tasks,
                    label: "Tasks",
                  },
                  {
                    Icon: Icons.navigation.recurring,
                    label: "Recurring",
                  },
                  {
                    Icon: Icons.navigation.reminders,
                    label: "Reminders",
                  },
                  {
                    Icon: Icons.navigation.stats,
                    label: "Stats",
                  },
                  { Icon: Icons.actions.add, label: "Add" },
                  { Icon: Icons.actions.edit, label: "Edit" },
                  {
                    Icon: Icons.actions.delete,
                    label: "Delete",
                  },
                  {
                    Icon: Icons.status.success,
                    label: "Success",
                  },
                  { Icon: Icons.status.error, label: "Error" },
                  {
                    Icon: Icons.status.warning,
                    label: "Warning",
                  },
                  {
                    Icon: Icons.time.calendar,
                    label: "Calendar",
                  },
                  { Icon: Icons.time.clock, label: "Clock" },
                  { Icon: Icons.priority.flag, label: "Flag" },
                  {
                    Icon: Icons.progress.flame,
                    label: "Flame",
                  },
                  {
                    Icon: Icons.progress.target,
                    label: "Target",
                  },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-3 bg-syt-card border border-syt-border rounded-lg"
                  >
                    <Icon className="w-6 h-6 text-syt-accent" />
                    <span className="text-xs text-syt-text-muted text-center">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Screens Tab */}
        {activeTab === "screens" && (
          <>
            <section>
              <h2 className="mb-4">Demo Screens</h2>
              <p className="text-sm text-syt-text-secondary mb-4">
                Tap on any screen to view the full
                implementation
              </p>

              {/* ── Product screens with 5-tab nav ─────────────────────────── */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-syt-border" />
                  <span className="text-xs text-syt-accent font-semibold px-2 py-0.5 bg-syt-accent/10 rounded-full border border-syt-accent/30">
                    5-tab ProductBottomNav
                  </span>
                  <div className="h-px flex-1 bg-syt-border" />
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {/* Home — 5-tab nav */}
                <button
                  onClick={() => setActiveTab("home")}
                  className="w-full flex items-center justify-between p-4 bg-syt-card border border-syt-accent/30 rounded-xl hover:border-syt-accent/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-syt-accent/10 flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-syt-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-syt-text mb-0.5">
                        Home
                      </h4>
                      <p className="text-sm text-syt-text-secondary">
                        Multi-day hub · accordion sections · FAB
                        · ProductBottomNav
                      </p>
                    </div>
                  </div>
                  <Icons.ui.chevronRight className="w-5 h-5 text-syt-accent flex-shrink-0" />
                </button>

                {/* Tracker — placeholder for now */}
                <div className="w-full flex items-center justify-between p-4 bg-syt-card border border-syt-border rounded-xl opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-syt-surface flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-4 h-4 text-syt-text-muted" />
                    </div>
                    <div>
                      <h4 className="font-medium text-syt-text mb-0.5">
                        Tracker (Coming Soon)
                      </h4>
                      <p className="text-sm text-syt-text-secondary">
                        Single-day focus · date nav · progress ·
                        ProductBottomNav
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Other screens ───────────────────────────────────────────── */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-syt-border" />
                  <span className="text-xs text-syt-text-muted px-2">
                    Other screens
                  </span>
                  <div className="h-px flex-1 bg-syt-border" />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowScreen("task-details")}
                  className="w-full flex items-center justify-between p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-medium text-syt-text mb-1">
                      Task Details
                    </h4>
                    <p className="text-sm text-syt-text-secondary">
                      Full task details with actions and
                      activity
                    </p>
                  </div>
                  <Icons.ui.chevronRight className="w-5 h-5 text-syt-text-muted" />
                </button>

                <button
                  onClick={() => setShowScreen("create-task")}
                  className="w-full flex items-center justify-between p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-medium text-syt-text mb-1">
                      Create Task
                    </h4>
                    <p className="text-sm text-syt-text-secondary">
                      Form to create a new task with all options
                    </p>
                  </div>
                  <Icons.ui.chevronRight className="w-5 h-5 text-syt-text-muted" />
                </button>

                <button
                  onClick={() => setShowScreen("stats")}
                  className="w-full flex items-center justify-between p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left"
                >
                  <div>
                    <h4 className="font-medium text-syt-text mb-1">
                      Statistics
                    </h4>
                    <p className="text-sm text-syt-text-secondary">
                      Analytics dashboard with charts and
                      progress
                    </p>
                  </div>
                  <Icons.ui.chevronRight className="w-5 h-5 text-syt-text-muted" />
                </button>
              </div>
            </section>

            <Divider label="Component Examples" />

            {/* Example Screens Content */}
            <section>
              <h2 className="mb-4">Task List Example</h2>
              <div className="space-y-3">
                <TaskCard
                  title="Design review meeting"
                  description="Prepare presentation slides and gather feedback"
                  priority="high"
                  status="active"
                  dueDate="Today, 2:00 PM"
                  completed={false}
                  onToggleComplete={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
                <TaskCard
                  title="Update documentation"
                  priority="medium"
                  status="active"
                  dueDate="Tomorrow"
                  completed={false}
                  onToggleComplete={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
                <TaskCard
                  title="Code review"
                  priority="low"
                  status="done"
                  completed={true}
                  onToggleComplete={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            </section>
          </>
        )}

        {/* Home Tab — renders HomeScreen content without ProductBottomNav */}
        {activeTab === "home" && (
          <HomeScreen
            activeTab="home"
            showProductNav={false}
            contentOnly={true}
          />
        )}
      </main>

      <BottomNav
        items={sections}
        activeId={activeTab}
        onItemClick={setActiveTab}
      />

      {/* Floating Action Button */}
      {activeTab === "advanced" && (
        <FloatingActionButton
          icon={<Plus className="w-6 h-6" />}
          onClick={() => toast.info("FAB clicked!")}
        />
      )}

      {/* Modal */}
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title="Modal Title"
        description="This is a desktop modal component"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-syt-text-secondary">
            This is the modal content. You can put any content
            here including forms, lists, or other components.
          </p>
        </div>
      </Modal>

      {/* Bottom Sheet */}
      <BottomSheet
        open={showBottomSheet}
        onOpenChange={setShowBottomSheet}
        title="Bottom Sheet"
        description="This is a mobile-friendly bottom sheet"
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowBottomSheet(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => setShowBottomSheet(false)}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div className="py-4 space-y-3">
          <p className="text-syt-text-secondary">
            Bottom sheets are great for mobile interfaces. They
            slide up from the bottom and can be dismissed by
            dragging down.
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-syt-surface border border-syt-border rounded-lg">
              Option 1
            </div>
            <div className="p-3 bg-syt-surface border border-syt-border rounded-lg">
              Option 2
            </div>
            <div className="p-3 bg-syt-surface border border-syt-border rounded-lg">
              Option 3
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Delete Task?"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => toast.success("Task deleted")}
      />
    </div>
  );
}

// Helper component for color swatches
function ColorSwatch({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-syt-surface border border-syt-border rounded-lg">
      <div
        className="w-10 h-10 rounded-md border border-syt-border flex-shrink-0"
        style={{ backgroundColor: value }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-syt-text truncate">
          {name}
        </p>
        <p className="text-xs text-syt-text-muted truncate">
          {value}
        </p>
      </div>
    </div>
  );
}