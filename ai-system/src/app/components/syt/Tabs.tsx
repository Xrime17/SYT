import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export function Tabs({
  items,
  value,
  onValueChange,
  variant = 'default',
  className,
}: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      <TabsPrimitive.List
        className={cn(
          'inline-flex items-center gap-1',
          variant === 'default' && 'bg-syt-surface p-1 rounded-lg border border-syt-border',
          variant === 'pills' && 'gap-2',
          variant === 'underline' && 'border-b border-syt-divider w-full gap-0',
          className
        )}
      >
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className={cn(
              'inline-flex items-center justify-center gap-2 px-4 py-2',
              'font-medium text-sm transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-syt-focus-ring',

              // Default variant
              variant === 'default' && [
                'rounded-md',
                'text-syt-text-secondary',
                'data-[state=active]:bg-syt-card data-[state=active]:text-syt-text data-[state=active]:shadow-sm',
                'hover:text-syt-text',
              ],

              // Pills variant
              variant === 'pills' && [
                'rounded-lg border border-transparent',
                'text-syt-text-secondary',
                'data-[state=active]:bg-syt-accent-subtle data-[state=active]:text-syt-accent data-[state=active]:border-syt-accent/20',
                'hover:text-syt-text hover:bg-syt-surface',
              ],

              // Underline variant
              variant === 'underline' && [
                'relative rounded-none border-b-2 border-transparent flex-1',
                'text-syt-text-secondary',
                'data-[state=active]:text-syt-text data-[state=active]:border-syt-accent',
                'hover:text-syt-text',
              ]
            )}
          >
            {item.icon && <span className="flex items-center">{item.icon}</span>}
            {item.label}
            {item.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-xs font-medium rounded-full min-w-[20px] text-center',
                  variant === 'pills' && 'bg-syt-surface text-syt-text-secondary data-[state=active]:bg-syt-accent data-[state=active]:text-white',
                  variant !== 'pills' && 'bg-syt-accent-subtle text-syt-accent'
                )}
              >
                {item.badge}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}

export const TabsContent = TabsPrimitive.Content;
