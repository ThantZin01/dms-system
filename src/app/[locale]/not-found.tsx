import { AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-md w-full text-center space-y-5 surface-elevated p-8 rounded-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#146B26] dark:text-[#4ADE80]">
            Error 404
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Page Not Found
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            The page you requested does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#002B5B] hover:bg-[#003B7A] dark:bg-[#1E6BB8] dark:hover:bg-[#287BD0] px-6 text-sm font-semibold text-white transition-colors w-full"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
