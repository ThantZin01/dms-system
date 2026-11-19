"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 md:h-10 w-full rounded-xl border border-slate-300/90 dark:border-slate-700 bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--foreground)] transition-colors duration-150 placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-400 dark:hover:border-slate-500 focus:border-[#002B5B] dark:focus:border-[#2D7DD2] focus:outline-none focus:ring-2 focus:ring-[#002B5B]/15 dark:focus:ring-[#2D7DD2]/25 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
