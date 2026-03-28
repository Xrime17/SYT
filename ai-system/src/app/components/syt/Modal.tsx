import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { Drawer } from 'vaul';

// Desktop Modal using Radix Dialog
export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-syt-backdrop backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%]',
            'bg-syt-surface-2 border border-syt-border rounded-2xl shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'focus:outline-none',
            sizeClasses[size],
            className
          )}
        >
          <div className="flex flex-col max-h-[85vh]">
            {/* Header */}
            {(title || description) && (
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {title && (
                      <Dialog.Title className="font-semibold text-syt-text mb-1">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="text-sm text-syt-text-secondary">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close className="p-2 text-syt-text-muted hover:text-syt-text hover:bg-syt-surface rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                  </Dialog.Close>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-2 overflow-y-auto flex-1">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="p-6 pt-4 border-t border-syt-divider">{footer}</div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Mobile Bottom Sheet using Vaul
export interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  snapPoints?: number[];
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  snapPoints,
  className,
}: BottomSheetProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      modal
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-syt-backdrop backdrop-blur-sm z-50" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'bg-syt-surface-2 border-t border-syt-border',
            'rounded-t-2xl flex flex-col max-h-[95vh]',
            'focus:outline-none',
            className
          )}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-syt-border rounded-full" />
          </div>

          {/* Header */}
          {(title || description) && (
            <div className="px-6 py-4 border-b border-syt-divider">
              {title && (
                <Drawer.Title className="font-semibold text-syt-text mb-1">
                  {title}
                </Drawer.Title>
              )}
              {description && (
                <Drawer.Description className="text-sm text-syt-text-secondary">
                  {description}
                </Drawer.Description>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-6 pt-4 border-t border-syt-divider">{footer}</div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
