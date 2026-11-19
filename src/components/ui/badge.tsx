import { cn } from "@/lib/utils";

export type BadgeVariant = "navy" | "green" | "amber" | "sky" | "rose" | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  navy: "bg-[#EAF1F8] text-[#002B5B] border-[#002B5B]/15 dark:bg-[#2D7DD2]/15 dark:text-[#7BB8F7] dark:border-[#2D7DD2]/25",
  green: "bg-[#EAF6ED] text-[#146B26] border-[#146B26]/15 dark:bg-[#2CA548]/15 dark:text-[#5CE07B] dark:border-[#2CA548]/25",
  amber: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25",
  sky: "bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/25",
  rose: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25",
  neutral: "bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const dotClasses: Record<BadgeVariant, string> = {
  navy: "bg-[#002B5B] dark:bg-[#7BB8F7]",
  green: "bg-[#146B26] dark:bg-[#4ADE80]",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  neutral: "bg-slate-400",
};

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotClasses[variant])} />}
      {children}
    </span>
  );
}
