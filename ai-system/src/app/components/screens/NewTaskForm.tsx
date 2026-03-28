import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomSheet } from '../syt/Modal';
import { Input, Textarea } from '../syt/Input';
import { Toggle } from '../syt/Checkbox';
import { Button } from '../syt/Button';
import { FilterChip } from '../syt/FilterChip';

export interface NewTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: NewTaskData) => void;
  initialData?: Partial<NewTaskData>;
  mode?: 'create' | 'edit';
}

export interface NewTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  taskType: 'task' | 'goal' | 'note';
  recurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
  daysOfWeek?: string[];
  endDate?: string;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const taskTypeOptions = [
  { value: 'task', label: 'Task' },
  { value: 'goal', label: 'Goal' },
  { value: 'note', label: 'Note' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

const daysOfWeekOptions = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

export function NewTaskForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'create',
}: NewTaskFormProps) {
  const [formData, setFormData] = useState<NewTaskData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    taskType: initialData?.taskType || 'task',
    recurring: initialData?.recurring || false,
    frequency: initialData?.frequency || 'daily',
    daysOfWeek: initialData?.daysOfWeek || [],
    endDate: initialData?.endDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onOpenChange(false);
  };

  const toggleDayOfWeek = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek?.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...(prev.daysOfWeek || []), day],
    }));
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'New Task' : 'Edit Task'}
      description="Fill in the details below"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title *"
          placeholder="Enter task title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Add details (optional)..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        {/* Priority */}
        <div>
          <label className="block text-syt-text mb-2">Priority</label>
          <div className="flex gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: option.value as any })}
                className={cn(
                  'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                  'border-2',
                  formData.priority === option.value
                    ? 'bg-syt-accent text-white border-syt-accent'
                    : 'bg-syt-surface text-syt-text border-syt-border hover:border-syt-accent/50'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Type */}
        <div>
          <label className="block text-syt-text mb-2">Task type</label>
          <div className="flex gap-2">
            {taskTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, taskType: option.value as any })}
                className={cn(
                  'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
                  'border-2',
                  formData.taskType === option.value
                    ? 'bg-syt-accent text-white border-syt-accent'
                    : 'bg-syt-surface text-syt-text border-syt-border hover:border-syt-accent/50'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recurring Toggle */}
        <div className="pt-2 pb-4 border-t border-syt-divider">
          <Toggle
            label="Recurring task"
            checked={formData.recurring}
            onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
          />
        </div>

        {/* Recurring Options (conditional) */}
        {formData.recurring && (
          <div className="space-y-4 pl-4 border-l-2 border-syt-accent/30">
            {/* Frequency */}
            <div>
              <label className="block text-syt-text mb-2">Frequency *</label>
              <div className="grid grid-cols-2 gap-2">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: option.value as any })}
                    className={cn(
                      'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                      'border-2',
                      formData.frequency === option.value
                        ? 'bg-syt-accent text-white border-syt-accent'
                        : 'bg-syt-surface text-syt-text border-syt-border hover:border-syt-accent/50'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Days of Week (when Weekly is selected) */}
            {formData.frequency === 'weekly' && (
              <div>
                <label className="block text-syt-text mb-2">Days of week</label>
                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeekOptions.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDayOfWeek(day.value)}
                      className={cn(
                        'py-2 px-1 rounded-lg text-xs font-medium transition-all',
                        'border-2',
                        formData.daysOfWeek?.includes(day.value)
                          ? 'bg-syt-accent text-white border-syt-accent'
                          : 'bg-syt-surface text-syt-text-muted border-syt-border hover:border-syt-accent/50'
                      )}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* End Date */}
            <Input
              label="End date (optional)"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="sticky bottom-0 pt-4 -mx-6 px-6 pb-6 bg-syt-surface-2 border-t border-syt-divider">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!formData.title}
          >
            {mode === 'create' ? 'Add task' : 'Save changes'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
