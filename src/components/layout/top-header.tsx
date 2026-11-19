"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  Sun,
  Moon,
  Monitor,
  Globe,
  LogOut,
  Settings,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { NotificationBell } from "./notification-bell";
import { BrandLogo } from "@/components/brand/brand-logo";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  role?: string;
  name?: string;
  email?: string;
  image?: string | null;
}

const routeMeta: Record<string, { title: string; section: string }> = {
  "/": { title: "Overview", section: "Executive Dashboard" },
  "/people": { title: "People Directory", section: "Residence" },
  "/garbage": { title: "Garbage Duty", section: "Residence" },
  "/water": { title: "Water Bottles", section: "Residence" },
  "/fees": { title: "Dormitory Fees", section: "Finance" },
  "/expenses": { title: "Shared Expenses", section: "Finance" },
  "/accounts": { title: "System Accounts", section: "Administration" },
  "/settings": { title: "Settings", section: "Administration" },
};

export function TopHeader({ role, name, email, image }: TopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const tSidebar = useTranslations("Sidebar");
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentRoute =
    routeMeta[pathname] ||
    Object.entries(routeMeta).find(
      ([key]) => key !== "/" && pathname?.startsWith(key)
    )?.[1] ||
    routeMeta["/"];

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "my" : "en" });
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 md:h-16 shrink-0 items-center justify-between gap-3 px-4 md:px-7 bg-[#001B3A] text-white border-b border-white/10 md:bg-[var(--surface)]/95 md:text-[var(--foreground)] md:border-[var(--border)] md:backdrop-blur-md">
      {/* MOBILE LEFT: Signature Deep Navy App Header with Emblem + Page Title */}
      <div className="flex md:hidden items-center gap-2.5 min-w-0">
        <Link href="/" className="shrink-0">
          <BrandLogo variant="icon" className="h-8 w-8 rounded-lg" />
        </Link>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-white truncate leading-tight">
            {currentRoute.title}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6EE787] truncate">
            {currentRoute.section}
          </p>
        </div>
      </div>

      {/* DESKTOP LEFT: Crisp Architectural Breadcrumb */}
      <div className="hidden md:flex items-center gap-2.5 text-sm min-w-0">
        <span className="inline-flex h-2 w-2 rounded-full bg-[#146B26] dark:bg-[#4ADE80]" />
        <span className="text-[var(--muted-foreground)] font-medium">
          {currentRoute.section}
        </span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-bold text-[var(--foreground)] truncate">
          {currentRoute.title}
        </span>
      </div>

      {/* RIGHT UTILITY CLUSTER */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Desktop Quick Language Toggle */}
        <button
          type="button"
          onClick={toggleLocale}
          title="Switch language"
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
        >
          <Globe className="h-3.5 w-3.5 text-[#002B5B] dark:text-[#7BB8F7]" />
          <span className="uppercase">{locale === "en" ? "EN" : "MY"}</span>
        </button>

        {/* Desktop Quick Theme Toggle */}
        <button
          type="button"
          onClick={cycleTheme}
          title={mounted ? `Theme: ${theme}` : "Switch theme"}
          className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
        >
          {!mounted ? (
            <Monitor className="h-4 w-4" />
          ) : theme === "light" ? (
            <Sun className="h-4 w-4 text-amber-500" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4 text-[#7BB8F7]" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
        </button>

        {/* Notifications (White icon on Mobile Navy Bar, Standard on Desktop) */}
        <NotificationBell />

        {/* Account Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl p-1 md:pl-1.5 md:pr-2.5 md:py-1 border border-transparent md:border-[var(--border)] md:bg-[var(--surface)] hover:bg-white/10 md:hover:bg-[var(--muted)] transition-colors cursor-pointer"
            aria-label="Account menu"
          >
            <div className="h-8 w-8 md:h-7 md:w-7 rounded-full overflow-hidden bg-white/15 md:bg-[#002B5B] text-white flex items-center justify-center text-xs font-bold ring-1 ring-[#6EE787]/40 md:ring-[#146B26]/20 shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                (name ? name.charAt(0) : "U").toUpperCase()
              )}
            </div>
            <span className="hidden lg:block text-xs font-semibold text-[var(--foreground)] max-w-[110px] truncate">
              {name || "User"}
            </span>
            <ChevronDown
              className={cn(
                "hidden md:block h-3.5 w-3.5 text-slate-400 transition-transform",
                userMenuOpen && "rotate-180"
              )}
            />
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-60 surface-elevated rounded-2xl z-50 overflow-hidden py-1.5 text-[var(--foreground)]">
                <div className="px-3.5 py-2.5 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[var(--foreground)] truncate">
                      {name || "User"}
                    </p>
                    {role === "ADMIN" && (
                      <ShieldCheck className="h-3.5 w-3.5 text-[#146B26] dark:text-[#4ADE80] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
                    {email || (role === "ADMIN" ? "System Administrator" : "Resident")}
                  </p>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    {tSidebar("settings")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    {tSidebar("logout")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
