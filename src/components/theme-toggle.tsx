"use client";


import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[50px]"></div>;

  return (
    <div className="flex gap-4 items-center h-[50px]">
      <button
        onClick={() => setTheme("system")}
        className={`group relative h-10 w-10 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${theme === "system" ? "border-emerald-500 scale-110 ring-4 ring-emerald-500/20" : "border-gray-300 dark:border-gray-600"} bg-gradient-to-br from-gray-100 to-gray-400 dark:from-gray-600 dark:to-gray-900`}
        title="System Default"
      >
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">System</span>
      </button>

      <button
        onClick={() => setTheme("light")}
        className={`group relative h-10 w-10 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${theme === "light" ? "border-emerald-500 scale-110 ring-4 ring-emerald-500/20" : "border-gray-300 dark:border-gray-600"} bg-white`}
        title="Light Mode"
      >
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">Light</span>
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`group relative h-10 w-10 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${theme === "dark" ? "border-emerald-500 scale-110 ring-4 ring-emerald-500/20" : "border-gray-700"} bg-gray-950`}
        title="Dark Mode"
      >
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500 opacity-0 transition-opacity group-hover:opacity-100">Dark</span>
      </button>
    </div>
  );
}
