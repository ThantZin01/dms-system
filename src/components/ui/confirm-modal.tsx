"use client";

import { Modal } from "./modal";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200/80 dark:border-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[var(--foreground)]">{title}</h3>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:flex-1"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
