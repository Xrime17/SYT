import { useState } from 'react';
import { ArrowLeft, Edit3, Trash2, Calendar, Clock, Flag, Tag, Repeat, Bell } from 'lucide-react';
import { Button } from '../syt/Button';
import { Badge, PriorityBadge } from '../syt/Badge';
import { Divider } from '../syt/Divider';
import { Checkbox } from '../syt/Checkbox';
import { cn } from '@/lib/utils';

export interface TaskDetailsScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TaskDetailsScreen({ onBack, onEdit, onDelete }: TaskDetailsScreenProps) {
  const [completed, setCompleted] = useState(false);

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
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-syt-text-muted hover:text-syt-accent hover:bg-syt-accent-subtle rounded-lg transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-syt-text-muted hover:text-syt-error hover:bg-syt-error-subtle rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Task Title & Completion */}
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox checked={completed} onChange={() => setCompleted(!completed)} />
          </div>
          <div className="flex-1">
            <h1
              className={cn(
                'mb-2',
                completed && 'line-through text-syt-text-muted'
              )}
            >
              Design review meeting
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority="high" />
              <Badge variant="accent">Active</Badge>
            </div>
          </div>
        </div>

        <Divider />

        {/* Description */}
        <section>
          <h3 className="mb-2">Description</h3>
          <p className="text-syt-text-secondary">
            Prepare presentation slides and gather feedback from the team. Make sure to include
            the latest design iterations and user feedback from the last sprint.
          </p>
        </section>

        <Divider />

        {/* Details */}
        <section className="space-y-3">
          <h3 className="mb-3">Details</h3>

          <div className="flex items-center gap-3 p-3 bg-syt-card border border-syt-border rounded-lg">
            <Calendar className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Due Date</p>
              <p className="text-sm text-syt-text-secondary">Today, March 18</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-syt-card border border-syt-border rounded-lg">
            <Clock className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Time</p>
              <p className="text-sm text-syt-text-secondary">2:00 PM - 3:00 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-syt-card border border-syt-border rounded-lg">
            <Bell className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text">Reminder</p>
              <p className="text-sm text-syt-text-secondary">30 minutes before</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-syt-card border border-syt-border rounded-lg">
            <Tag className="w-5 h-5 text-syt-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium text-syt-text mb-2">Tags</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 text-xs bg-syt-surface text-syt-text-secondary rounded-md">
                  Work
                </span>
                <span className="px-2 py-1 text-xs bg-syt-surface text-syt-text-secondary rounded-md">
                  Design
                </span>
                <span className="px-2 py-1 text-xs bg-syt-surface text-syt-text-secondary rounded-md">
                  Meeting
                </span>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Activity */}
        <section>
          <h3 className="mb-3">Activity</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-syt-success mt-2" />
              <div className="flex-1">
                <p className="text-sm text-syt-text">Task created</p>
                <p className="text-xs text-syt-text-muted">March 15, 2026 at 9:30 AM</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-syt-accent mt-2" />
              <div className="flex-1">
                <p className="text-sm text-syt-text">Priority changed to High</p>
                <p className="text-xs text-syt-text-muted">March 16, 2026 at 2:15 PM</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
