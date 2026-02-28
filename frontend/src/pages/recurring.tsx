import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';

export default function RecurringPage() {
  return (
    <Layout>
      <h1 className="text-xl font-semibold text-slate-900 mb-6">Повторения</h1>
      <Card className="p-8 text-center">
        <p className="text-slate-500">Загрузка…</p>
        <p className="text-slate-400 text-sm mt-2">Правила повторений появятся здесь</p>
      </Card>
    </Layout>
  );
}
