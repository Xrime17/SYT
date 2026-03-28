/**
 * Icon System for SYT Design System
 *
 * This file exports a consistent set of icons for the task & habit tracker app.
 * All icons use lucide-react with consistent sizing: 16px, 20px, 24px
 * Style: Outline, minimal, consistent stroke width
 */

import {
  // Navigation
  Home,
  ListTodo,
  Repeat,
  Bell,
  BarChart3,
  User,
  Settings,

  // Actions
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Save,
  Copy,
  Share2,
  Download,
  Upload,
  MoreHorizontal,
  MoreVertical,

  // Time & Date
  Calendar,
  Clock,
  CalendarDays,
  Timer,
  History,

  // Status
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  MinusCircle,

  // Priority & Flags
  Flag,
  Star,
  Bookmark,
  Pin,

  // Task Management
  Archive,
  Inbox,
  Send,
  Filter,
  Search,
  SlidersHorizontal,
  Tag,
  Paperclip,

  // Progress & Stats
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Flame,
  Award,

  // UI Elements
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Menu,
  GripVertical,
  Eye,
  EyeOff,

  // Other
  Sun,
  Moon,
  LogOut,
  HelpCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

// Export all icons in organized groups
export const Icons = {
  // Navigation
  navigation: {
    home: Home,
    tasks: ListTodo,
    recurring: Repeat,
    reminders: Bell,
    stats: BarChart3,
    profile: User,
    settings: Settings,
  },

  // Actions
  actions: {
    add: Plus,
    edit: Edit3,
    delete: Trash2,
    check: Check,
    close: X,
    save: Save,
    copy: Copy,
    share: Share2,
    download: Download,
    upload: Upload,
    moreHorizontal: MoreHorizontal,
    moreVertical: MoreVertical,
  },

  // Time & Date
  time: {
    calendar: Calendar,
    clock: Clock,
    calendarDays: CalendarDays,
    timer: Timer,
    history: History,
  },

  // Status
  status: {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    cancel: XCircle,
    neutral: MinusCircle,
  },

  // Priority
  priority: {
    flag: Flag,
    star: Star,
    bookmark: Bookmark,
    pin: Pin,
  },

  // Task Management
  taskManagement: {
    archive: Archive,
    inbox: Inbox,
    send: Send,
    filter: Filter,
    search: Search,
    settings: SlidersHorizontal,
    tag: Tag,
    attachment: Paperclip,
  },

  // Progress & Stats
  progress: {
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    activity: Activity,
    target: Target,
    zap: Zap,
    flame: Flame,
    award: Award,
  },

  // UI Elements
  ui: {
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronUp: ChevronUp,
    chevronDown: ChevronDown,
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    menu: Menu,
    drag: GripVertical,
    eye: Eye,
    eyeOff: EyeOff,
  },

  // Other
  other: {
    sun: Sun,
    moon: Moon,
    logout: LogOut,
    help: HelpCircle,
    externalLink: ExternalLink,
    refresh: RefreshCw,
  },
};

// Export individual icons for convenience
export {
  // Navigation
  Home,
  ListTodo,
  Repeat,
  Bell,
  BarChart3,
  User,
  Settings,

  // Actions
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Save,
  Copy,
  Share2,
  Download,
  Upload,
  MoreHorizontal,
  MoreVertical,

  // Time & Date
  Calendar,
  Clock,
  CalendarDays,
  Timer,
  History,

  // Status
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  MinusCircle,

  // Priority & Flags
  Flag,
  Star,
  Bookmark,
  Pin,

  // Task Management
  Archive,
  Inbox,
  Send,
  Filter,
  Search,
  SlidersHorizontal,
  Tag,
  Paperclip,

  // Progress & Stats
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Flame,
  Award,

  // UI Elements
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Menu,
  GripVertical,
  Eye,
  EyeOff,

  // Other
  Sun,
  Moon,
  LogOut,
  HelpCircle,
  ExternalLink,
  RefreshCw,
};

// Icon sizes (use with className)
export const iconSizes = {
  sm: 'w-4 h-4',  // 16px
  md: 'w-5 h-5',  // 20px
  lg: 'w-6 h-6',  // 24px
};
