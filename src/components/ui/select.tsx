"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-11 md:h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-3.5 pr-10 py-2 text-sm text-[var(--foreground)] transition-colors duration-150 hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#002B5B] dark:focus:border-[#2D7DD2] focus:outline-none focus:ring-2 focus:ring-[#002B5B]/15 dark:focus:ring-[#2D7DD2]/25 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>
    );
  }
);
Select.displayName = "Select";
