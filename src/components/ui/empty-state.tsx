import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 px-6 text-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/60",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-navy-soft)] text-[var(--brand-navy)] mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-[var(--foreground)]">{title}</h3>
      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-xs leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
