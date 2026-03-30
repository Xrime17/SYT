import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SytAccordion = AccordionPrimitive.Root;

const SytAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-syt-divider last:border-b-0', className)}
    {...props}
  />
));
SytAccordionItem.displayName = 'SytAccordionItem';

const SytAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    count?: number;
  }
>(({ className, children, count, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-3 px-3 -mx-3',
        'text-left font-semibold text-syt-text text-base',
        'transition-all duration-200',
        'hover:bg-syt-surface/50 active:bg-syt-surface rounded-lg',
        'focus-visible:outline-none',
        'group touch-manipulation',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {count !== undefined && (
          <span className="text-xs text-syt-text-muted font-normal bg-syt-surface px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <ChevronDown
        className={cn(
          'h-5 w-5 shrink-0 text-syt-text-secondary',
          'transition-transform duration-200',
          'group-data-[state=open]:rotate-180'
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
SytAccordionTrigger.displayName = 'SytAccordionTrigger';

const SytAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden',
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      'transition-all duration-200'
    )}
    {...props}
  >
    <div className={cn('pt-0 pb-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
SytAccordionContent.displayName = 'SytAccordionContent';

export { SytAccordion, SytAccordionItem, SytAccordionTrigger, SytAccordionContent };