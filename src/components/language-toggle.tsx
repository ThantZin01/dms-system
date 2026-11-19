"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const options = [
    { id: "en", label: "English" },
    { id: "my", label: "မြန်မာ (Burmese)" },
  ];

  return (
    <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
      {options.map((opt) => {
        const active = locale === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => changeLanguage(opt.id)}
            className={cn(
              "flex items-center justify-center h-9 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              active
                ? "bg-[var(--surface)] text-[#002B5B] dark:text-white shadow-xs ring-1 ring-[#002B5B]/10 dark:ring-white/10"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
