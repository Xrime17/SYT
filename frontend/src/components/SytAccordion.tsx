'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

const SytAccordion = AccordionPrimitive.Root;

const SytAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={`border-b border-[var(--syt-border)] last:border-b-0 ${className ?? ''}`}
    {...props}
  />
));
SytAccordionItem.displayName = 'SytAccordionItem';

const SytAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { count?: number }
>(({ className, children, count, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={`syt-accordion-trigger group flex flex-1 items-center justify-between gap-3 rounded-lg py-4 px-1 -mx-1 text-left font-medium text-[var(--syt-text)] transition-colors hover:bg-[var(--syt-surface)]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--syt-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--syt-background)] disabled:pointer-events-none disabled:opacity-50 ${className ?? ''}`}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span>{children}</span>
        {count !== undefined ? (
          <span className="text-xs font-normal text-[var(--syt-text-muted)]">
            {count} {count === 1 ? 'task' : 'tasks'}
          </span>
        ) : null}
      </span>
      <svg
        className="syt-accordion-chevron h-5 w-5 shrink-0 text-[var(--syt-text-muted)]"
        aria-hidden
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
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
    className={`syt-accordion-content overflow-hidden ${className ?? ''}`}
    {...props}
  >
    <div className="flex flex-col gap-3 pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
SytAccordionContent.displayName = 'SytAccordionContent';

export { SytAccordion, SytAccordionItem, SytAccordionTrigger, SytAccordionContent };
