'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TaskItem } from '@/components/TaskItem';
import { useUser } from '@/context/UserContext';
import { useTelegramUser } from '@/hooks/useTelegramUser';
import { getTasks, updateTask, deleteTask, type Task } from '@/api/tasks';

const BOT_LINK = process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK ?? 'https://t.me/save_you_time_bot';

export default function TasksPage() {
  const { user } = useUser();
  const { isInTelegram, loading: telegramLoading, error: telegramError } = useTelegramUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setError(null);
    getTasks(user.id)
      .then(setTasks)
      .catch((e) => {
        const msg = e instanceof Error ? e.message : 'Не удалось загрузить задачи';
        setError(msg === 'Failed to fetch' ? 'Не удалось загрузить задачи. Проверьте подключение.' : msg);
      })
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
  const showList = user && !loading && tasks.length > 0;
  const showEmptyState = user && !loading && tasks.length === 0 && !error;
  const showErrorState = user && error;
  const showAddButton = user && !loading;

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

      {!isInTelegram && !user && (
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mx-auto mb-4">
            ✨
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Откройте в Telegram</h2>
          <p className="text-slate-600 text-sm mb-6">
            Нажмите <strong>Start</strong> в боте, затем кнопку <strong>Open</strong>, чтобы войти и управлять задачами.
          </p>
          <a
            href={BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="rounded-2xl px-6">Открыть бота</Button>
          </a>
        </Card>
      )}

      {isInTelegram && telegramLoading && !user && (
        <div className="flex flex-col items-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Вход…</p>
        </div>
      )}

      {isInTelegram && telegramError && !user && (
        <Card className="p-6 max-w-md mx-auto border-amber-200 bg-amber-50/80">
          <p className="text-amber-800 font-medium mb-1">Не удалось подключиться</p>
          <p className="text-amber-700/90 text-sm mb-4">{telegramError}</p>
          <p className="text-amber-700/80 text-xs mb-4">Проверьте интернет и обновите страницу.</p>
          <Button variant="secondary" className="w-full rounded-2xl" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
        </Card>
      )}

      {user && loading && (
        <div className="flex flex-col items-center py-12">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Загрузка задач…</p>
        </div>
      )}

      {showErrorState && (
        <Card className="p-4 mb-4 border-amber-200 bg-amber-50/80">
          <p className="text-amber-800 text-sm">{error}</p>
          <p className="text-amber-700/80 text-xs mt-1">Проверьте подключение и обновите страницу.</p>
        </Card>
      )}

      {showEmptyState && (
        <Card className="p-8 text-center mb-4">
          <p className="text-slate-600 mb-6">У вас пока нет задач. Добавьте первую.</p>
          <Link href="/tasks/new">
            <Button className="rounded-2xl px-6">+ Добавить задачу</Button>
          </Link>
        </Card>
      )}

      {showList && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleDone={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAddButton && (showList || showErrorState) && (
        <div className="mt-6">
          <Link href="/tasks/new" className="block">
            <Button variant="secondary" className="w-full rounded-2xl py-3">
              + Добавить задачу
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  );
}
