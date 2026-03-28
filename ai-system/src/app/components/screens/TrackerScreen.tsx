import { useState } from 'react';
import { Settings, Plus, Droplet, Utensils, Dumbbell, Book, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCard } from '../syt/TaskCard';
import { FloatingActionButton } from '../syt/FloatingActionButton';
import { ProductBottomNav, type ProductTabId } from '../syt/ProductBottomNav';
import { CategoryChipStrip } from '../syt/CategoryChip';
import { EmptyState } from '../syt/EmptyState';
import { CircularProgress } from '../syt/Progress';
import { NewTaskForm, type NewTaskData } from './NewTaskForm';

// Mock data
const categories = [
  { id: 'water',    label: 'Water',   icon: <Droplet   className="w-5 h-5" /> },
  { id: 'reading',  label: 'Reading', icon: <Book      className="w-5 h-5" /> },
  { id: 'food',     label: 'Food',    icon: <Utensils  className="w-5 h-5" /> },
  { id: 'exercise', label: 'Fitness', icon: <Dumbbell  className="w-5 h-5" /> },
];

const trackerTasks = [
  {
    id: '1',
    title: 'Design review meeting',
    time: '10:00',
    priority: 'low' as const,
    status: 'done' as const,
    completed: true,
    reminderEnabled: true,
  },
  {
    id: '2',
    title: 'Design review meeting',
    time: '14:00',
    priority: 'high' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: true,
  },
  {
    id: '3',
    title: 'Update project documentation',
    time: '16:30',
    description: 'Add new API endpoints and examples',
    priority: 'medium' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: false,
  },
];

export interface TrackerScreenProps {
  /** Currently active product tab (default: 'tracker') */
  activeTab?: ProductTabId | string;
  /** Called when user taps a product nav tab */
  onNavigate?: (tab: string) => void;
  onAddTask?: () => void;
  onTaskClick?: (taskId: string) => void;
}

export function TrackerScreen({
  activeTab = 'tracker',
  onNavigate,
  onAddTask,
  onTaskClick,
}: TrackerScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('water');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskStates, setTaskStates] = useState<
    Record<string, { completed: boolean; reminderEnabled: boolean }>
  >({
    '1': { completed: true,  reminderEnabled: true },
    '2': { completed: false, reminderEnabled: true },
    '3': { completed: false, reminderEnabled: false },
  });

  const toggleComplete = (taskId: string) => {
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], completed: !prev[taskId].completed },
    }));
  };

  const toggleReminder = (taskId: string) => {
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], reminderEnabled: !prev[taskId].reminderEnabled },
    }));
  };

  const handleSubmitTask = (data: NewTaskData) => {
    console.log('New task:', data);
  };

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const completedToday = trackerTasks.filter((t) => taskStates[t.id]?.completed).length;
  const totalTasks = trackerTasks.length;
  const progressPercent = totalTasks > 0 ? (completedToday / totalTasks) * 100 : 0;

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-syt-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-syt-background/80 backdrop-blur-lg border-b border-syt-border">
        <div className="max-w-screen-sm mx-auto px-4 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="mb-1">Tracker</h1>
              <p className="text-sm text-syt-text-secondary">
                Single-day focus · {totalTasks} tasks
              </p>
            </div>
            <button
              className={cn(
                'p-2 rounded-lg',
                'bg-syt-card border border-syt-border',
                'text-syt-text-muted hover:text-syt-text hover:border-syt-accent/50',
                'transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syt-focus-ring'
              )}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Date Navigation strip */}
          <div className="flex items-center justify-between mb-4 bg-syt-card border border-syt-border rounded-xl p-3">
            <button
              onClick={() => navigateDay('prev')}
              className="p-1 text-syt-text-muted hover:text-syt-text rounded-lg hover:bg-syt-surface transition-colors"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="font-medium text-syt-text">{formatDate(selectedDate)}</p>
              <p className="text-xs text-syt-text-muted">
                {selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => navigateDay('next')}
              className="p-1 text-syt-text-muted hover:text-syt-text rounded-lg hover:bg-syt-surface transition-colors"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Completion progress */}
          <div className="flex items-center gap-4 mb-4">
            <CircularProgress value={progressPercent} size={56} variant="accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">
                {completedToday} of {totalTasks} completed
              </p>
              <p className="text-xs text-syt-text-muted">
                {totalTasks - completedToday} remaining
              </p>
            </div>
          </div>

          {/* Category Strip */}
          <CategoryChipStrip
            items={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
            onAdd={() => console.log('Add category')}
          />
        </div>
      </header>

      {/* Main Content — flat list sorted by time */}
      <main className="max-w-screen-sm mx-auto px-4 py-6">
        {trackerTasks.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-12 h-12" />}
            title="No tasks for today"
            description="You're all caught up! Add a task to stay productive."
            primaryAction={{
              label: 'Add Task',
              onClick: () => setShowNewTaskForm(true),
              icon: <Plus className="w-4 h-4" />,
            }}
          />
        ) : (
          <div className="space-y-3">
            {trackerTasks
              .sort((a, b) => {
                if (a.time && b.time) return a.time.localeCompare(b.time);
                return 0;
              })
              .map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  time={task.time}
                  description={task.description}
                  priority={task.priority}
                  status={task.status}
                  completed={taskStates[task.id]?.completed ?? task.completed}
                  reminderEnabled={taskStates[task.id]?.reminderEnabled ?? task.reminderEnabled}
                  onToggleComplete={() => toggleComplete(task.id)}
                  onToggleReminder={() => toggleReminder(task.id)}
                  onEdit={() => console.log('Edit', task.id)}
                  onDelete={() => console.log('Delete', task.id)}
                />
              ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <FloatingActionButton
        icon={<Plus className="w-6 h-6" />}
        position="bottom-right"
        onClick={() => setShowNewTaskForm(true)}
        aria-label="Add task"
      />

      {/* ✅ ProductBottomNav — single source of truth, 5 tabs, Tracker active */}
      <ProductBottomNav activeId={activeTab} onItemClick={handleNavClick} />

      {/* New Task Form */}
      <NewTaskForm
        open={showNewTaskForm}
        onOpenChange={setShowNewTaskForm}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}
