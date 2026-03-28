/**
 * ProductBottomNav — Single source of truth for the Telegram Mini App product chrome.
 *
 * 5 tabs, fixed order:
 *   1. Home      (house icon)   — default active
 *   2. Tracker   (calendar icon)
 *   3. Tasks     (list-todo icon)
 *   4. Recurring (repeat icon)
 *   5. Reminders (bell icon)
 *
 * Usage:
 *   <ProductBottomNav activeId="home" onItemClick={(id) => navigate(id)} />
 *   <ProductBottomNav activeId="tracker" onItemClick={...} badges={{ tasks: 3 }} />
 */

import { Home, CalendarDays, ListTodo, Repeat, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PRODUCT_TAB_IDS = ['home', 'tracker', 'tasks', 'recurring', 'reminders'] as const;
export type ProductTabId = (typeof PRODUCT_TAB_IDS)[number];

export interface ProductNavBadges {
  home?: number;
  tracker?: number;
  tasks?: number;
  recurring?: number;
  reminders?: number;
}

export interface ProductBottomNavProps {
  /** Currently active tab id */
  activeId: ProductTabId | string;
  /** Called when user taps a tab */
  onItemClick: (id: string) => void;
  /** Optional badge counts per tab. Defaults to tasks=5, reminders=2 for demo */
  badges?: ProductNavBadges;
  className?: string;
}

const DEFAULT_BADGES: ProductNavBadges = {
  tasks: 5,
  reminders: 2,
};

interface TabDef {
  id: ProductTabId;
  label: string;
  icon: React.ReactNode;
}

export function ProductBottomNav({
  activeId,
  onItemClick,
  badges = DEFAULT_BADGES,
  className,
}: ProductBottomNavProps) {
  const tabs: TabDef[] = [
    { id: 'home',      label: 'Home',      icon: <Home      className="w-6 h-6" strokeWidth={2} /> },
    { id: 'tracker',   label: 'Tracker',   icon: <CalendarDays className="w-6 h-6" strokeWidth={2} /> },
    { id: 'tasks',     label: 'Tasks',     icon: <ListTodo  className="w-6 h-6" strokeWidth={2} /> },
    { id: 'recurring', label: 'Recurring', icon: <Repeat    className="w-6 h-6" strokeWidth={2} /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell      className="w-6 h-6" strokeWidth={2} /> },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-syt-surface/80 backdrop-blur-lg border-t border-syt-border',
        'safe-area-inset-bottom z-50',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const badge = badges[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onItemClick(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 px-1 rounded-xl',
                'transition-all duration-200',
                isActive
                  ? 'text-syt-accent'
                  : 'text-syt-text-secondary hover:text-syt-text hover:bg-syt-card'
              )}
            >
              {/* Icon + badge */}
              <div className="relative">
                <div
                  className={cn(
                    'transition-transform duration-200',
                    isActive && 'scale-110'
                  )}
                >
                  {tab.icon}
                </div>
                {badge !== undefined && badge > 0 && (
                  <div className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-syt-error text-white text-xs rounded-full flex items-center justify-center leading-none">
                    {badge > 99 ? '99+' : badge}
                  </div>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs transition-all duration-200 truncate',
                  isActive ? 'font-semibold' : 'font-medium'
                )}
              >
                {tab.label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-syt-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
