'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

const BOT_LINK = process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK ?? 'https://t.me/save_you_time_bot';

export function OpenInTelegramCard() {
  return (
    <Card className="mb-6 p-8 text-center max-w-md">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/25">
        ✨
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Откройте в Telegram</h2>
      <p className="text-slate-600 text-sm mb-6">
        Нажмите <strong>Start</strong> в боте, затем кнопку <strong>Open</strong>, чтобы войти.
      </p>
      <a href={BOT_LINK} target="_blank" rel="noopener noreferrer" className="inline-block">
        <Button className="rounded-2xl px-6">Открыть бота</Button>
      </a>
    </Card>
  );
}
