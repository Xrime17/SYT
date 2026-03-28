// SYT Design System - Component Library
// Task & Habit Tracker UI Kit for Telegram Mini App

// === BASIC COMPONENTS ===
export { Button, type ButtonProps } from './Button';
export { Input, Textarea, type InputProps, type TextareaProps } from './Input';
export { Checkbox, Toggle, type CheckboxProps, type ToggleProps } from './Checkbox';
export {
  Badge,
  PriorityBadge,
  StatusBadge,
  FrequencyBadge,
  type BadgeProps,
  type PriorityBadgeProps,
  type StatusBadgeProps,
  type FrequencyBadgeProps,
  type Priority,
  type Status,
  type Frequency,
} from './Badge';
export { TaskCard, RecurringCard, type TaskCardProps, type RecurringCardProps } from './TaskCard';
export { FilterChip, FilterGroup, type FilterChipProps, type FilterGroupProps } from './FilterChip';
export { BottomNav, type BottomNavProps, type NavItem } from './BottomNav';
export {
  ProductBottomNav,
  PRODUCT_TAB_IDS,
  type ProductBottomNavProps,
  type ProductTabId,
  type ProductNavBadges,
} from './ProductBottomNav';
export { AppHeader, type AppHeaderProps } from './AppHeader';
export { EmptyState, type EmptyStateProps } from './EmptyState';
export {
  LoadingState,
  LoadingSpinner,
  Skeleton,
  TaskCardSkeleton,
  type LoadingSpinnerProps,
  type SkeletonProps,
} from './LoadingState';

// === ADVANCED COMPONENTS ===
export { Modal, BottomSheet, type ModalProps, type BottomSheetProps } from './Modal';
export { Tabs, TabsContent, type TabsProps, type TabItem } from './Tabs';
export { SegmentedControl, type SegmentedControlProps, type SegmentItem } from './SegmentedControl';
export { FloatingActionButton, FAB, type FABProps } from './FloatingActionButton';
export { Toaster, toast } from './Toast';
export { Alert, type AlertProps } from './Alert';
export { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';
export {
  ProgressBar,
  CircularProgress,
  StreakIndicator,
  CompletionStats,
  type ProgressBarProps,
  type CircularProgressProps,
  type StreakIndicatorProps,
  type CompletionStatsProps,
} from './Progress';
export {
  SwipeActions,
  TaskSwipeActions,
  type SwipeActionsProps,
  type TaskSwipeActionsProps,
  type SwipeAction,
} from './SwipeActions';
export { CalendarStrip, type CalendarStripProps, type DayData } from './CalendarStrip';
export { Divider, type DividerProps } from './Divider';
export { DragHandle, type DragHandleProps } from './DragHandle';
export { TaskListItem, type TaskListItemProps } from './TaskListItem';

// === ICON SYSTEM ===
export { Icons, iconSizes } from './Icons';

// === LAYOUT & PATTERNS ===
export { CategoryChip, CategoryChipStrip, type CategoryChipProps, type CategoryChipStripProps } from './CategoryChip';
export {
  SytAccordion,
  SytAccordionItem,
  SytAccordionTrigger,
  SytAccordionContent,
} from './Accordion';