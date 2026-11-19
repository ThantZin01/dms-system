"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string;
  variant?: "dialog" | "drawer";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  variant = "dialog",
  size = "md",
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => setVisible(true));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sizeClass =
    size === "sm"
      ? "md:max-w-sm"
      : size === "lg"
      ? "md:max-w-xl"
      : "md:max-w-md";

  const isDrawer = variant === "drawer";

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex transition-opacity duration-200",
        isDrawer
          ? "items-end md:items-stretch md:justify-end"
          : "items-end md:items-center md:justify-center md:p-4",
        visible
          ? "bg-slate-950/55 dark:bg-black/70 backdrop-blur-[2px] opacity-100"
          : "bg-slate-950/0 opacity-0"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn(
          "w-full flex flex-col bg-[var(--surface)] border-[var(--border)] shadow-2xl overflow-hidden transition-transform duration-200 ease-out",
          // Mobile: always native slide-up bottom sheet
          "rounded-t-2xl border-t max-h-[90dvh]",
          // Desktop: either right-side slide-over drawer or centered dialog
          isDrawer
            ? "md:rounded-none md:rounded-l-2xl md:border-t-0 md:border-l md:max-h-screen md:h-full md:w-[440px]"
            : cn("md:rounded-2xl md:border md:max-h-[85vh]", sizeClass),
          visible
            ? "translate-y-0 md:translate-x-0 md:scale-100"
            : isDrawer
            ? "translate-y-full md:translate-y-0 md:translate-x-full"
            : "translate-y-full md:translate-y-3 md:scale-[0.98]"
        )}
      >
        {/* Mobile bottom-sheet drag handle */}
        <div className="flex justify-center pt-2.5 pb-1 md:hidden shrink-0">
          <div className="h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-3.5 md:px-6 md:py-4">
          <div className="min-w-0">
            <h2 className="text-[17px] md:text-lg font-bold tracking-tight text-[var(--foreground)] truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 md:px-6 md:py-5 pb-safe">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
