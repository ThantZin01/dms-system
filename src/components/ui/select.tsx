"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 w-full appearance-none rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-base shadow-inner backdrop-blur-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-black/20 dark:text-white cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
