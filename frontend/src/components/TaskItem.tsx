import React from 'react';
import type { Task } from '@/api/tasks';
import { Card } from './Card';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  return (
    <Card className="flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{task.title}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {task.status} · {task.priority}
          {task.dueDate && ` · ${new Date(task.dueDate).toLocaleDateString()}`}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Изменить
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="text-sm text-red-600 hover:underline dark:text-red-400"
          >
            Удалить
          </button>
        )}
      </div>
    </Card>
  );
}
