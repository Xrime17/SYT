import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Flag, Tag, Bell, Repeat } from 'lucide-react';
import { Button } from '../syt/Button';
import { Input, Textarea } from '../syt/Input';
import { SegmentedControl } from '../syt/SegmentedControl';
import { Divider } from '../syt/Divider';

export interface CreateTaskScreenProps {
  onBack?: () => void;
  onSave?: (task: any) => void;
}

export function CreateTaskScreen({ onBack, onSave }: CreateTaskScreenProps) {
  const [priority, setPriority] = useState('medium');

  const handleSave = () => {
    onSave?.({
      title: 'New Task',
      priority,
    });
  };

  return (
    <div className="min-h-screen bg-syt-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-syt-surface-2 border-b border-syt-divider backdrop-blur-sm">
        <div className="max-w-screen-sm mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>New Task</h2>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Basic Info */}
        <section className="space-y-4">
          <Input label="Task Name" placeholder="Enter task name..." />
          <Textarea
            label="Description"
            placeholder="Add task description..."
            rows={4}
          />
        </section>

        <Divider />

        {/* Priority */}
        <section>
          <label className="block mb-3 text-sm font-medium text-syt-text">
            Priority
          </label>
          <SegmentedControl
            fullWidth
            items={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            value={priority}
            onValueChange={setPriority}
          />
        </section>

        <Divider />

        {/* Date & Time */}
        <section className="space-y-3">
          <button className="w-full flex items-center gap-3 p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left">
            <Calendar className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Due Date</p>
              <p className="text-sm text-syt-text-secondary">Select date</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left">
            <Clock className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Time</p>
              <p className="text-sm text-syt-text-secondary">Select time</p>
            </div>
          </button>
        </section>

        <Divider />

        {/* Additional Options */}
        <section className="space-y-3">
          <button className="w-full flex items-center gap-3 p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left">
            <Bell className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Reminder</p>
              <p className="text-sm text-syt-text-secondary">Set reminder</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left">
            <Repeat className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Repeat</p>
              <p className="text-sm text-syt-text-secondary">Does not repeat</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-4 bg-syt-card border border-syt-border rounded-xl hover:border-syt-accent/30 transition-colors text-left">
            <Tag className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Tags</p>
              <p className="text-sm text-syt-text-secondary">Add tags</p>
            </div>
          </button>
        </section>

        {/* Bottom spacing for FAB */}
        <div className="h-20" />
      </main>
    </div>
  );
}
