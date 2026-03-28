import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  icon?: React.ReactNode;
  className?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  icon,
  className,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 bg-syt-backdrop backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%]',
            'bg-syt-surface-2 border border-syt-border rounded-2xl shadow-lg p-6',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'focus:outline-none',
            className
          )}
        >
          {/* Icon */}
          {(icon || variant === 'destructive') && (
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  variant === 'destructive'
                    ? 'bg-syt-error-subtle text-syt-error'
                    : 'bg-syt-accent-subtle text-syt-accent'
                )}
              >
                {icon || <AlertTriangle className="w-6 h-6" />}
              </div>
            </div>
          )}

          {/* Title */}
          <AlertDialogPrimitive.Title className="font-semibold text-syt-text text-center mb-2">
            {title}
          </AlertDialogPrimitive.Title>

          {/* Description */}
          <AlertDialogPrimitive.Description className="text-sm text-syt-text-secondary text-center mb-6">
            {description}
          </AlertDialogPrimitive.Description>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="secondary" className="flex-1" onClick={handleCancel}>
                {cancelLabel}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'primary'}
                className="flex-1"
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
