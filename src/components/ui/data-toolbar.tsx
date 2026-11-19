"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface DataToolbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  activeFilter?: string;
  onFilterChange?: (val: string) => void;
  rightContent?: React.ReactNode;
  className?: string;
}

export function DataToolbar({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  activeFilter,
  onFilterChange,
  rightContent,
  className,
}: DataToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-center md:justify-between", className)}>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center flex-1 min-w-0">
        {onSearchChange && (
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 md:h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-8 text-sm text-[var(--foreground)] placeholder:text-slate-400 focus:border-[#002B5B] dark:focus:border-[#2D7DD2] focus:outline-none focus:ring-2 focus:ring-[#002B5B]/15 dark:focus:ring-[#2D7DD2]/25 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {filters && filters.length > 0 && onFilterChange && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
            {filters.map((option) => {
              const isActive = activeFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFilterChange(option.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer border",
                    isActive
                      ? "bg-[#002B5B] text-white border-[#002B5B] dark:bg-[#1E6BB8] dark:border-[#1E6BB8] shadow-2xs"
                      : "bg-[var(--surface)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <span>{option.label}</span>
                  {option.count !== undefined && (
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.2 text-[10px] tabular-nums",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {rightContent && (
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
}
