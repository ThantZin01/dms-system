import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
  inverted?: boolean;
}

export function BrandLogo({
  variant = "compact",
  className,
  inverted = false,
}: BrandLogoProps) {
  if (variant === "full") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center transition-colors",
          inverted
            ? "rounded-2xl bg-white/95 px-5 py-3.5 shadow-sm"
            : "dark:rounded-2xl dark:bg-white/95 dark:px-5 dark:py-3.5",
          className
        )}
      >
        <Image
          src="/images/dorm-logo-full.png"
          alt="Dormitory Management System"
          width={286}
          height={246}
          priority
          className="h-24 w-auto sm:h-28 object-contain"
        />
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs ring-1 ring-black/8 overflow-hidden",
          className
        )}
      >
        <Image
          src="/images/dorm-mark.png"
          alt="Dormitory Management System"
          width={36}
          height={36}
          priority
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 min-w-0", className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs ring-1 ring-black/10 overflow-hidden">
        <Image
          src="/images/dorm-mark.png"
          alt="Dormitory Management System"
          width={36}
          height={36}
          priority
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col min-w-0 leading-tight">
        <span
          className={cn(
            "text-[15px] font-bold tracking-tight truncate",
            inverted ? "text-white" : "text-[#002B5B] dark:text-slate-100"
          )}
        >
          Dormitory
        </span>
        <span
          className={cn(
            "text-[10.5px] font-semibold tracking-[0.06em] uppercase truncate mt-0.5",
            inverted ? "text-[#6EE787]" : "text-[#146B26] dark:text-[#4ADE80]"
          )}
        >
          Management System
        </span>
      </div>
    </div>
  );
}
