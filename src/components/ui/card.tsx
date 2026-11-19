import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("surface-card rounded-2xl overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-sm md:text-[15px] font-bold tracking-tight text-[var(--foreground)]",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-[var(--muted-foreground)] mt-0.5", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

interface MetricCardProps {
  href?: string;
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  tone?: "navy" | "green" | "amber" | "sky" | "rose";
}

const toneIconStyles = {
  navy: "bg-[#EAF1F8] text-[#002B5B] dark:bg-[#2D7DD2]/15 dark:text-[#7BB8F7]",
  green: "bg-[#EAF6ED] text-[#146B26] dark:bg-[#2CA548]/15 dark:text-[#4ADE80]",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

const toneAccentBar = {
  navy: "bg-[#002B5B] dark:bg-[#2D7DD2]",
  green: "bg-[#146B26] dark:bg-[#2CA548]",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
};

export function MetricCard({
  href,
  label,
  value,
  sublabel,
  icon: Icon,
  tone = "navy",
}: MetricCardProps) {
  const inner = (
    <div className="group relative surface-card rounded-2xl p-4 md:p-5 flex flex-col justify-between h-full transition-all duration-150 hover:border-[#002B5B]/35 dark:hover:border-[#2D7DD2]/40 overflow-hidden">
      <span
        className={cn(
          "absolute top-0 inset-x-0 h-[3px] opacity-85",
          toneAccentBar[tone]
        )}
      />
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)] truncate">
          {label}
        </span>
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            toneIconStyles[tone]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-xl md:text-[22px] font-bold tracking-tight text-[var(--foreground)] tabular-nums truncate">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1 truncate">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
