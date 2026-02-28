'use client';

import React from 'react';
import type { Task } from '@/api/tasks';

interface TaskItemProps {
  task: Task;
  onToggleDone?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskItem({ task, onToggleDone, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm group">
      <button
        type="button"
        onClick={() => onToggleDone?.(task)}
        className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        style={{
          borderColor: isCompleted ? 'var(--accent, #6366f1)' : '#cbd5e1',
          backgroundColor: isCompleted ? 'var(--accent, #6366f1)' : 'transparent',
        }}
        aria-label={isCompleted ? 'Отметить невыполненным' : 'Выполнено'}
      >
        {isCompleted && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`font-medium text-slate-800 truncate ${
            isCompleted ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-slate-400">{task.status}</span>
          {task.dueDate && (
            <span className="text-xs text-slate-400">
              {new Date(task.dueDate).toLocaleDateString('ru-RU')}
            </span>
          )}
        </div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="shrink-0 p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Удалить"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}
