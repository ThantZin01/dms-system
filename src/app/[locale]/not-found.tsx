import { AlertTriangle } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md text-center space-y-6 bg-white dark:bg-black p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            404
          </h2>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
            Page Not Found
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
