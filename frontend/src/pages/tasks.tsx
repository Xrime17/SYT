import { Layout } from '@/components/Layout';

export default function TasksPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Задачи
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">Загрузка…</p>
    </Layout>
  );
}
