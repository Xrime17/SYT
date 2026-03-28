import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export interface BottomNavProps {
  items: NavItem[];
  activeId: string;
  onItemClick: (id: string) => void;
  className?: string;
}

export function BottomNav({ items, activeId, onItemClick, className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-syt-surface/80 backdrop-blur-lg border-t border-syt-border',
        'safe-area-inset-bottom z-50',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-screen-sm mx-auto">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-3 rounded-xl',
                'transition-all duration-200',
                isActive
                  ? 'text-syt-accent'
                  : 'text-syt-text-muted hover:text-syt-text-secondary hover:bg-syt-card'
              )}
            >
              <div className="relative">
                <div className={cn(
                  'transition-transform duration-200',
                  isActive && 'scale-110'
                )}>
                  {item.icon}
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-syt-error text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
              </div>
              <span className={cn(
                'text-xs font-medium transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-syt-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
