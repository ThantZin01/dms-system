import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface MobileTab {
  label: string;
  href: string;
  active: boolean;
}

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  mobileTabs?: MobileTab[];
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  mobileTabs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile-only segmented switcher for paired operational domains (e.g. Garbage | Water, Expenses | Fees) */}
      {mobileTabs && mobileTabs.length > 0 && (
        <div className="md:hidden flex p-1 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          {mobileTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold transition-all",
                tab.active
                  ? "bg-[var(--surface)] text-[#002B5B] dark:text-white shadow-xs"
                  : "text-[var(--muted-foreground)]"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop & Mobile Header Row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="hidden md:block text-[11px] font-bold uppercase tracking-[0.14em] text-[#146B26] dark:text-[#4ADE80] mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="text-xl md:text-[26px] font-bold tracking-tight text-[var(--foreground)] leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs md:text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Desktop top-right primary CTA (mobile uses thumb-zone FAB or inline button) */}
        {action && (
          <div className="flex items-center gap-2 shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
