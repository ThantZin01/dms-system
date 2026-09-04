"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Common");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global runtime error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md text-center space-y-6 bg-white dark:bg-black p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
          <AlertCircle className="h-8 w-8 text-rose-600 dark:text-rose-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Something went wrong!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            An unexpected error has occurred. We've been notified and are looking into it.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs text-left overflow-auto rounded-lg max-h-40 font-mono">
              {error.message}
            </div>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
