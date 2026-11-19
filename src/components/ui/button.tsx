"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "subtle";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B5B]/40 dark:focus-visible:ring-[#2D7DD2]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer whitespace-nowrap",
          {
            "bg-[#002B5B] text-white shadow-xs hover:bg-[#003B7A] dark:bg-[#1E6BB8] dark:hover:bg-[#287BD0]":
              variant === "default",
            "bg-[#146B26] text-white shadow-xs hover:bg-[#0F561E] dark:bg-[#1F8A36] dark:hover:bg-[#26A040]":
              variant === "secondary",
            "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-elevated)] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs":
              variant === "outline",
            "bg-[var(--muted)] text-[var(--foreground)] hover:bg-slate-200/80 dark:hover:bg-slate-800":
              variant === "subtle",
            "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]":
              variant === "ghost",
            "bg-rose-600 text-white shadow-xs hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500":
              variant === "destructive",
            "h-11 md:h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-xs rounded-lg": size === "sm",
            "h-12 px-6 text-[15px]": size === "lg",
            "h-9 w-9 p-0 rounded-lg": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
