import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DayData {
  date: Date;
  label: string;
  dayOfWeek: string;
  isToday?: boolean;
  hasTask?: boolean;
  isCompleted?: boolean;
}

export interface CalendarStripProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  daysToShow?: number;
  highlightedDates?: Date[];
  completedDates?: Date[];
  className?: string;
}

export function CalendarStrip({
  selectedDate = new Date(),
  onDateSelect,
  daysToShow = 7,
  highlightedDates = [],
  completedDates = [],
  className,
}: CalendarStripProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek;
    return new Date(today.setDate(diff));
  });

  const generateDays = (): DayData[] => {
    const days: DayData[] = [];
    const start = new Date(currentWeekStart);

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const hasTask = highlightedDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );

      const isCompleted = completedDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );

      days.push({
        date,
        label: date.getDate().toString(),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday,
        hasTask,
        isCompleted,
      });
    }

    return days;
  };

  const days = generateDays();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + (direction === 'next' ? daysToShow : -daysToShow));
    setCurrentWeekStart(newStart);
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        onClick={() => navigateWeek('prev')}
        className="p-2 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded-lg transition-colors"
        aria-label="Previous week"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => onDateSelect?.(day.date)}
            className={cn(
              'flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200',
              'min-w-[60px]',
              isSelected(day.date)
                ? 'bg-syt-accent text-white shadow-lg'
                : 'bg-syt-card border border-syt-border text-syt-text-secondary hover:border-syt-accent/30 hover:text-syt-text',
              day.isToday && !isSelected(day.date) && 'border-syt-accent'
            )}
          >
            <span className="text-xs font-medium">{day.dayOfWeek}</span>
            <span className="text-lg font-semibold">{day.label}</span>
            {/* Indicator dots */}
            <div className="flex items-center gap-1 min-h-[6px]">
              {day.hasTask && !day.isCompleted && (
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isSelected(day.date) ? 'bg-white' : 'bg-syt-accent'
                  )}
                />
              )}
              {day.isCompleted && (
                <div
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isSelected(day.date) ? 'bg-white' : 'bg-syt-success'
                  )}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => navigateWeek('next')}
        className="p-2 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded-lg transition-colors"
        aria-label="Next week"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
