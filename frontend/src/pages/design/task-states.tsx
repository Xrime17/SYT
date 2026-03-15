'use client';

import { Layout } from '@/components/Layout';

/**
 * Visual task states — reference page from Figma frame.
 * Shows TASK ACTIVE, TASK COMPLETED, GOAL ACTIVE, NOTE ACTIVE, TASK ARCHIVED.
 */
export default function TaskStatesPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-[640px] mx-auto">
        <h1 className="text-base font-semibold text-[var(--syt-text)]">
          Visual task states
        </h1>

        {/* TASK · ACTIVE */}
        <div>
          <p className="text-xs font-medium text-[var(--syt-text-muted)] mb-2">
            TASK · ACTIVE
          </p>
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex items-center gap-3 min-h-[72px]">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="font-medium text-sm text-[var(--syt-text)]">
                Complete project report
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#395c7d] text-[#b2d6f6]">
                  ACTIVE
                </span>
                <span className="text-xs text-[var(--syt-text-secondary)]">
                  Due Mar 15
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#4a1a1a] text-[var(--syt-error)]">
                  HIGH
                </span>
              </div>
            </div>
            <span className="shrink-0 w-5 h-5 rounded border-2 border-[var(--syt-border)] bg-[var(--syt-card)]" />
          </div>
        </div>

        {/* TASK · COMPLETED */}
        <div>
          <p className="text-xs font-medium text-[var(--syt-text-muted)] mb-2">
            TASK · COMPLETED
          </p>
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex items-center gap-3 min-h-[72px]">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="font-medium text-sm text-[var(--syt-text)] opacity-60 line-through">
                Done task title
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1a2e20] text-[var(--syt-success)]">
                  COMPLETED
                </span>
                <span className="text-xs text-[var(--syt-text-secondary)] opacity-60">
                  Mar 10
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1a2e20] text-[var(--syt-success)] opacity-80">
                  LOW
                </span>
              </div>
            </div>
            <span className="shrink-0 w-5 h-5 rounded bg-[var(--syt-accent)] flex items-center justify-center text-white text-xs font-semibold">
              ✔
            </span>
          </div>
        </div>

        {/* GOAL · ACTIVE */}
        <div>
          <p className="text-xs font-medium text-[var(--syt-text-muted)] mb-2">
            GOAL · ACTIVE
          </p>
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex items-center gap-3 min-h-[72px]">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="font-medium text-sm text-[var(--syt-text)]">
                Weekly goal
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--syt-text-secondary)]">
                  ACTIVE · Due Mar 20
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#4c3915] text-[var(--syt-warning)]">
                  MEDIUM
                </span>
              </div>
            </div>
            <span className="shrink-0 w-5 h-5 rounded border-2 border-[var(--syt-border)] bg-[var(--syt-card)]" />
          </div>
        </div>

        {/* NOTE · ACTIVE */}
        <div>
          <p className="text-xs font-medium text-[var(--syt-text-muted)] mb-2">
            NOTE · ACTIVE
          </p>
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex items-center gap-3 min-h-[72px]">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="font-medium text-sm text-[var(--syt-text)]">
                Meeting notes
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--syt-text-secondary)]">
                  ACTIVE
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1a2e20] text-[var(--syt-success)]">
                  LOW
                </span>
              </div>
            </div>
            <span className="shrink-0 w-5 h-5 rounded border-2 border-[var(--syt-border)] bg-[var(--syt-card)]" />
          </div>
        </div>

        {/* TASK · ARCHIVED */}
        <div>
          <p className="text-xs font-medium text-[var(--syt-text-muted)] mb-2">
            TASK · ARCHIVED
          </p>
          <div className="rounded-[14px] border border-[var(--syt-border)] bg-[var(--syt-card)] p-4 flex items-center gap-3 min-h-[72px]">
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              <p className="font-medium text-sm text-[var(--syt-text-secondary)] opacity-80">
                Archived task
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[var(--syt-text-muted)]">
                  ARCHIVED · Mar 1
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#4c3915] text-[var(--syt-warning)]">
                  MEDIUM
                </span>
              </div>
            </div>
            <span className="shrink-0 w-5 h-5 rounded border-2 border-[var(--syt-border)] bg-[var(--syt-card)]" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
