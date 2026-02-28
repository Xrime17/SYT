import { Layout } from '@/components/Layout';

export default function RemindersPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Напоминания
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400">Загрузка…</p>
    </Layout>
  );
}
