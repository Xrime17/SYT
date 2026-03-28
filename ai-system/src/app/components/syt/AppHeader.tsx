import { cn } from '@/lib/utils';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backButton?: React.ReactNode;
  className?: string;
}

export function AppHeader({ title, subtitle, action, backButton, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-syt-background/80 backdrop-blur-lg border-b border-syt-border',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-sm mx-auto">
        {/* Left side */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {backButton && (
            <div className="flex-shrink-0">
              {backButton}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-syt-text truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-syt-text-muted truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right action */}
        {action && (
          <div className="flex-shrink-0 ml-3">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
