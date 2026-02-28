'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { TaskItem } from '@/components/TaskItem';
import { useUser } from '@/context/UserContext';
import { getTasks, updateTask, deleteTask, type Task } from '@/api/tasks';

export default function TasksPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    getTasks(user.id)
      .then(setTasks)
      .catch((e) => setError(e instanceof Error ? e.message : 'Ошибка'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleToggle = async (task: Task) => {
    if (!user) return;
    const newStatus = task.status === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
    try {
      const updated = await updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const handleDelete = async (task: Task) => {
    if (!confirm('Удалить задачу?')) return;
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Задачи</h1>
        {user && tasks.length > 0 && (
          <span className="text-sm text-slate-500">
            {completed}/{tasks.length}
          </span>
        )}
      </div>

      {!user && (
        <p className="text-slate-500 text-center py-8">
          Откройте приложение в Telegram (Start → Open).
        </p>
      )}

      {user && loading && (
        <p className="text-slate-500 text-center py-8">Загрузка…</p>
      )}

      {user && error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {user && !loading && !error && tasks.length === 0 && (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-8 text-center">
          <p className="text-slate-500 mb-4">У вас пока нет задач</p>
          <Link href="/tasks/new">
            <Button>+ Добавить задачу</Button>
          </Link>
        </div>
      )}

      {user && !loading && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleDone={handleToggle}
              onDelete={handleDelete}
            />
          ))}
          <Link href="/tasks/new" className="block mt-4">
            <Button variant="secondary" className="w-full rounded-2xl py-3">
              + Добавить задачу
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  );
}
