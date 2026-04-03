'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { Layout } from '@/components/Layout';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { useUser } from '@/context/UserContext';
import { getHomeCategories } from '@/api/home-categories';

export default function NewTaskPage() {
  const router = useRouter();
  const { user } = useUser();

  const { data: categoriesData, isLoading: categoriesLoading } = useSWR(
    user?.id ? (['home-categories', user.id] as const) : null,
    ([, uid]) => getHomeCategories(uid),
    { revalidateOnFocus: true }
  );
  const categoriesForForm = categoriesLoading ? undefined : (categoriesData ?? []);

  if (!user) {
    return (
      <Layout>
        <p className="text-sm text-[var(--syt-text-secondary)]">Open in Telegram.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <header className="flex items-center gap-3 h-12">
          <Link
            href="/tasks"
            className="w-10 h-10 rounded-[10px] bg-[var(--syt-card)] flex items-center justify-center text-[var(--syt-text)] font-medium text-xl hover:opacity-90"
            aria-label="Back"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-[var(--syt-text)]">New task</h1>
        </header>

        <CreateTaskForm
          userId={user.id}
          categories={categoriesForForm}
          allowRecurring
          onSuccess={() => router.push('/tasks')}
        />
      </div>
    </Layout>
  );
}
