import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';

export default function RemindersPage() {
  return (
    <Layout>
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Напоминания</h1>
      <Card className="p-8 text-center">
        <p className="text-slate-500">Загрузка…</p>
        <p className="text-slate-400 text-sm mt-2">Скоро здесь появятся напоминания</p>
      </Card>
    </Layout>
  );
}
