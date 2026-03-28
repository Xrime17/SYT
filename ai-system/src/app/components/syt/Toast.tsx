import { Toaster as Sonner, toast as sonnerToast } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      expand={false}
      richColors={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex items-start gap-3 w-full p-4 bg-syt-surface-2 border border-syt-border rounded-xl shadow-lg backdrop-blur-sm',
          title: 'text-sm font-medium text-syt-text',
          description: 'text-xs text-syt-text-secondary mt-1',
          actionButton:
            'ml-auto px-3 py-1.5 bg-syt-accent text-white text-xs font-medium rounded-lg hover:bg-syt-accent-hover transition-colors',
          cancelButton:
            'ml-auto px-3 py-1.5 bg-syt-surface text-syt-text text-xs font-medium rounded-lg border border-syt-border hover:bg-syt-card transition-colors',
          closeButton:
            'absolute top-4 right-4 p-1 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded-md transition-colors',
        },
      }}
    />
  );
}

// Toast utilities with icons
export const toast = {
  success: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
      icon: <CheckCircle2 className="w-5 h-5 text-syt-success flex-shrink-0" />,
    });
  },

  error: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
      icon: <AlertCircle className="w-5 h-5 text-syt-error flex-shrink-0" />,
    });
  },

  warning: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
      icon: <AlertTriangle className="w-5 h-5 text-syt-warning flex-shrink-0" />,
    });
  },

  info: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
      icon: <Info className="w-5 h-5 text-syt-accent flex-shrink-0" />,
    });
  },

  default: (message: string, description?: string) => {
    return sonnerToast(message, {
      description,
    });
  },

  promise: sonnerToast.promise,
  loading: sonnerToast.loading,
  dismiss: sonnerToast.dismiss,
};
