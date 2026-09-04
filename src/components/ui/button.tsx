"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 border border-white/20": variant === "default",
            "border-2 border-gray-200 bg-white/50 hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm backdrop-blur-sm": variant === "outline",
            "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-100": variant === "ghost",
            "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 border border-white/20": variant === "destructive",
            "h-12 px-6 py-3": size === "default",
            "h-10 px-4 py-2": size === "sm",
            "h-14 px-8 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
