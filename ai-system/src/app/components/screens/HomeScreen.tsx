import { useState } from 'react';
import { Settings, Plus, Droplet, Utensils, Dumbbell, Book, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskCard } from '../syt/TaskCard';
import { FloatingActionButton } from '../syt/FloatingActionButton';
import { ProductBottomNav, type ProductTabId } from '../syt/ProductBottomNav';
import { CategoryChipStrip } from '../syt/CategoryChip';
import { EmptyState } from '../syt/EmptyState';
import {
  SytAccordion,
  SytAccordionItem,
  SytAccordionTrigger,
  SytAccordionContent,
} from '../syt/Accordion';
import { NewTaskForm, type NewTaskData } from './NewTaskForm';

// Mock data
const categories = [
  { id: 'water',    label: 'Water',   icon: <Droplet   className="w-5 h-5" /> },
  { id: 'reading',  label: 'Reading', icon: <Book      className="w-5 h-5" /> },
  { id: 'food',     label: 'Food',    icon: <Utensils  className="w-5 h-5" /> },
  { id: 'exercise', label: 'Fitness', icon: <Dumbbell  className="w-5 h-5" /> },
];

const todayTasks = [
  {
    id: '1',
    title: 'Design review meeting',
    time: '14:00',
    priority: 'high' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: true,
  },
  {
    id: '2',
    title: 'Update project documentation',
    time: '16:30',
    description: 'Add new API endpoints and examples',
    priority: 'medium' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: false,
  },
  {
    id: '3',
    title: 'Team standup',
    time: '10:00',
    priority: 'low' as const,
    status: 'done' as const,
    completed: true,
    reminderEnabled: true,
  },
];

const tomorrowTasks = [
  {
    id: '4',
    title: 'Code review for PR #234',
    priority: 'medium' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: false,
  },
  {
    id: '5',
    title: 'Plan sprint retrospective',
    priority: 'low' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: true,
  },
];

const thisWeekTasks = [
  {
    id: '6',
    title: 'Quarterly planning session',
    priority: 'high' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: false,
  },
  {
    id: '7',
    title: 'Client presentation prep',
    description: 'Prepare slides and demo environment',
    priority: 'high' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: true,
  },
  {
    id: '8',
    title: 'Update dependencies',
    priority: 'low' as const,
    status: 'active' as const,
    completed: false,
    reminderEnabled: false,
  },
];

export interface HomeScreenProps {
  /** Currently active product tab (default: 'home') */
  activeTab?: ProductTabId | string;
  /** Called when user taps a product nav tab — parent handles routing */
  onNavigate?: (tab: string) => void;
  onAddTask?: () => void;
  onTaskClick?: (taskId: string) => void;
  /**
   * Число для подзаголовка «N habits». В продукте: `GET /categories/home-metrics` → `totalHabits`
   * (число чипов HomeCategory; не отдельная сущность Habit с completion).
   */
  totalHabits?: number;
}

export function HomeScreen({
  activeTab = 'home',
  onNavigate,
  onAddTask,
  onTaskClick,
  totalHabits: totalHabitsProp,
}: HomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('water');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [taskStates, setTaskStates] = useState<
    Record<string, { completed: boolean; reminderEnabled: boolean }>
  >({
    '1': { completed: false, reminderEnabled: true },
    '2': { completed: false, reminderEnabled: false },
    '3': { completed: true,  reminderEnabled: true },
    '4': { completed: false, reminderEnabled: false },
    '5': { completed: false, reminderEnabled: true },
    '6': { completed: false, reminderEnabled: false },
    '7': { completed: false, reminderEnabled: true },
    '8': { completed: false, reminderEnabled: false },
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

  const totalHabits = totalHabitsProp ?? 2;
  const allTasks = [...todayTasks, ...tomorrowTasks, ...thisWeekTasks];
  const hasNoTasks = allTasks.length === 0;

  return (
    <div className="min-h-screen bg-syt-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-syt-background/80 backdrop-blur-lg border-b border-syt-border">
        <div className="max-w-screen-sm mx-auto px-4 py-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="mb-1">Home</h1>
              <p className="text-sm text-syt-text-secondary">
                Today · {allTasks.length} tasks · {totalHabits} habits
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

          {/* Category / Habit chip strip */}
          <CategoryChipStrip
            items={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
            onAdd={() => console.log('Add category')}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6">
        {hasNoTasks ? (
          <EmptyState
            icon={<CalendarDays className="w-12 h-12" />}
            title="No tasks yet"
            description="Start planning your day by adding your first task"
            primaryAction={{
              label: 'Add Task',
              onClick: () => setShowNewTaskForm(true),
              icon: <Plus className="w-4 h-4" />,
            }}
          />
        ) : (
          <SytAccordion type="multiple" defaultValue={['today']} className="space-y-1">
            {/* Today — expanded by default */}
            <SytAccordionItem value="today">
              <SytAccordionTrigger count={todayTasks.length}>Today</SytAccordionTrigger>
              <SytAccordionContent>
                <div className="space-y-3">
                  {todayTasks.map((task) => (
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
              </SytAccordionContent>
            </SytAccordionItem>

            {/* Tomorrow — collapsed by default */}
            <SytAccordionItem value="tomorrow">
              <SytAccordionTrigger count={tomorrowTasks.length}>Tomorrow</SytAccordionTrigger>
              <SytAccordionContent>
                <div className="space-y-3">
                  {tomorrowTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
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
              </SytAccordionContent>
            </SytAccordionItem>

            {/* This week — collapsed by default */}
            <SytAccordionItem value="this-week">
              <SytAccordionTrigger count={thisWeekTasks.length}>This week</SytAccordionTrigger>
              <SytAccordionContent>
                <div className="space-y-3">
                  {thisWeekTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
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
              </SytAccordionContent>
            </SytAccordionItem>
          </SytAccordion>
        )}
      </main>

      {/* FAB — opens NewTaskForm bottom sheet */}
      <FloatingActionButton
        icon={<Plus className="w-6 h-6" />}
        position="bottom-right"
        onClick={() => setShowNewTaskForm(true)}
        aria-label="Add task"
      />

      {/* ✅ ProductBottomNav — single source of truth, 5 tabs */}
      <ProductBottomNav activeId={activeTab} onItemClick={handleNavClick} />

      {/* New Task Form bottom sheet */}
      <NewTaskForm
        open={showNewTaskForm}
        onOpenChange={setShowNewTaskForm}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}
