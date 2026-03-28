'use client';

import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useUser } from '@/context/UserContext';

function PlaceholderSection({
  sectionId,
  title,
  description,
}: {
  sectionId: string;
  title: string;
  description: string;
}) {
  return (
    <section
      className="rounded-[var(--syt-radius-card)] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4"
      aria-labelledby={sectionId}
    >
      <h2 id={sectionId} className="text-sm font-semibold text-[var(--syt-text)] mb-1">
        {title}
      </h2>
      <p className="text-sm text-[var(--syt-text-muted)]">{description}</p>
    </section>
  );
}

export default function SettingsPage() {
  const { user, logout } = useUser();

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <header className="flex items-center gap-3">
          <Link
            href="/home"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--syt-radius-button)] border border-[var(--syt-border)] bg-[var(--syt-card)] text-[var(--syt-text)] text-lg hover:border-[var(--syt-accent)]/50 hover:text-[var(--syt-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)]"
            aria-label="Back to Home"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-[var(--syt-text)]">Settings</h1>
        </header>

        {!user ? (
          <Card className="border border-[var(--syt-border)] bg-[var(--syt-card)] p-6">
            <p className="text-sm text-[var(--syt-text-secondary)] mb-4">
              Sign in via Telegram to manage settings.
            </p>
            <Link
              href="/home"
              className="text-sm font-medium text-[var(--syt-accent)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] rounded"
            >
              Go to Home
            </Link>
          </Card>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <PlaceholderSection
                sectionId="settings-section-account"
                title="Account"
                description="Profile and linked data — coming soon."
              />
              <PlaceholderSection
                sectionId="settings-section-notifications"
                title="Notifications"
                description="Push and reminder defaults — coming soon."
              />
              <PlaceholderSection
                sectionId="settings-section-appearance"
                title="Appearance"
                description="Theme and density — coming soon."
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 border-t border-[var(--syt-border)]">
              <Button variant="secondary" className="rounded-xl w-full sm:w-auto" onClick={logout}>
                Выход
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
