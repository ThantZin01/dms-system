"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-md w-full text-center space-y-5 surface-elevated p-8 rounded-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            An unexpected error occurred while loading this view.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-200 text-xs text-left overflow-auto rounded-xl max-h-40 font-mono border border-rose-200 dark:border-rose-500/20">
              {error.message}
            </div>
          )}
        </div>

        <Button onClick={() => reset()} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
