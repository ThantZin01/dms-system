"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-11 w-full rounded-xl bg-[var(--muted)] animate-pulse" />;
  }

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={cn(
              "flex items-center justify-center gap-2 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              active
                ? "bg-[var(--surface)] text-[#002B5B] dark:text-white shadow-xs ring-1 ring-[#002B5B]/10 dark:ring-white/10"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
