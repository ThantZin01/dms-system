"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Wallet,
  MoreHorizontal,
  Trash2,
  Droplet,
  Banknote,
  Receipt,
  UserCircle,
  Settings,
  LogOut,
  Sun,
  Moon,
  Monitor,
  Globe,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Modal } from "@/components/ui/modal";

interface MobileNavProps {
  role?: string;
  name?: string;
  email?: string;
}

export function MobileNav({ role, name, email }: MobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const t = useTranslations("Sidebar");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setMoreOpen(false);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const isDutiesActive =
    pathname === "/garbage" ||
    pathname?.startsWith("/garbage/") ||
    pathname === "/water" ||
    pathname?.startsWith("/water/");

  const isFinanceActive =
    pathname === "/expenses" ||
    pathname?.startsWith("/expenses/") ||
    pathname === "/fees" ||
    pathname?.startsWith("/fees/");

  const isMoreActive =
    pathname === "/accounts" ||
    pathname?.startsWith("/accounts/") ||
    pathname === "/settings" ||
    pathname?.startsWith("/settings/");

  const tabs = [
    {
      label: "Home",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      label: t("people"),
      href: "/people",
      icon: Users,
      active: pathname === "/people" || pathname?.startsWith("/people/"),
    },
    {
      label: "Duties",
      href: "/garbage",
      icon: ClipboardCheck,
      active: isDutiesActive,
    },
    {
      label: "Finance",
      href: "/expenses",
      icon: Wallet,
      active: isFinanceActive,
    },
  ];

  const allSections = [
    { name: t("garbage"), subtitle: "Rotation queue & history", href: "/garbage", icon: Trash2 },
    { name: "Water Bottles", subtitle: "Stock & restock splits", href: "/water", icon: Droplet },
    { name: t("fees"), subtitle: "3-month residence fees", href: "/fees", icon: Banknote },
    { name: t("expenses"), subtitle: "Shared bills & utilities", href: "/expenses", icon: Receipt },
    ...(role === "ADMIN"
      ? [{ name: t("accounts"), subtitle: "User logins & permissions", href: "/accounts", icon: UserCircle }]
      : []),
    { name: t("settings"), subtitle: "Profile, security & app", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Native Mobile Fixed Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-lg pb-safe"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors",
                  tab.active
                    ? "text-[#002B5B] dark:text-[#5DA9F6]"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                {tab.active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-[#146B26] dark:bg-[#4ADE80]" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    tab.active && "stroke-[2.3]"
                  )}
                />
                <span className="truncate max-w-[60px]">{tab.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer",
              isMoreActive || moreOpen
                ? "text-[#002B5B] dark:text-[#5DA9F6]"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {isMoreActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-[#146B26] dark:bg-[#4ADE80]" />
            )}
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* Native Mobile Slide-Up Navigation & Preferences Sheet */}
      <Modal
        isOpen={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="Menu & Preferences"
        subtitle={name ? `${name} • ${role === "ADMIN" ? "Administrator" : "Resident"}` : undefined}
      >
        <div className="space-y-5">
          {/* Direct Route List */}
          <div className="space-y-1">
            {allSections.map((item) => {
              const Icon = item.icon;
              const isCurrent = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                    isCurrent
                      ? "bg-[#EAF1F8] text-[#002B5B] dark:bg-[#2D7DD2]/15 dark:text-[#7BB8F7]"
                      : "hover:bg-[var(--muted)] text-[var(--foreground)]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isCurrent
                        ? "bg-[#002B5B] text-white dark:bg-[#1E6BB8]"
                        : "bg-[var(--muted)] text-slate-600 dark:text-slate-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight">{item.name}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* Quick Appearance & Language Controls */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Theme
              </p>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--muted)]">
                {[
                  { id: "light", icon: Sun, label: "Light" },
                  { id: "dark", icon: Moon, label: "Dark" },
                  { id: "system", icon: Monitor, label: "Auto" },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const active = mounted && theme === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTheme(mode.id)}
                      aria-label={mode.label}
                      className={cn(
                        "flex items-center justify-center h-8 rounded-lg transition-all cursor-pointer",
                        active
                          ? "bg-[var(--surface)] text-[#002B5B] dark:text-white shadow-xs"
                          : "text-slate-500"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Language
              </p>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--muted)]">
                {[
                  { id: "en", label: "EN" },
                  { id: "my", label: "MY" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      setMoreOpen(false);
                      router.replace(pathname, { locale: lang.id });
                    }}
                    className={cn(
                      "flex items-center justify-center gap-1 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      locale === lang.id
                        ? "bg-[var(--surface)] text-[#002B5B] dark:text-white shadow-xs"
                        : "text-slate-500"
                    )}
                  >
                    <Globe className="h-3 w-3" />
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Account & Sign Out */}
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                {name || "Signed in"}
              </p>
              {email && (
                <p className="text-[11px] text-[var(--muted-foreground)] truncate">{email}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("logout")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
