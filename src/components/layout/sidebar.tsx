"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  LayoutDashboard,
  Users,
  Trash2,
  Banknote,
  Receipt,
  Settings,
  UserCircle,
  Droplet,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { BrandLogo } from "@/components/brand/brand-logo";

interface SidebarProps {
  role?: string;
  name?: string;
  email?: string;
  image?: string | null;
}

export function Sidebar({ role, name, email, image }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Sidebar");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dms-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("dms-sidebar-collapsed", String(next));
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const sections = [
    {
      label: "Overview",
      items: [{ name: t("dashboard"), href: "/", icon: LayoutDashboard }],
    },
    {
      label: "Residence",
      items: [
        { name: t("people"), href: "/people", icon: Users },
        { name: t("garbage"), href: "/garbage", icon: Trash2 },
        { name: "Water Bottles", href: "/water", icon: Droplet },
      ],
    },
    {
      label: "Finance",
      items: [
        { name: t("fees"), href: "/fees", icon: Banknote },
        { name: t("expenses"), href: "/expenses", icon: Receipt },
      ],
    },
    {
      label: "Administration",
      items: [
        ...(role === "ADMIN"
          ? [{ name: t("accounts"), href: "/accounts", icon: UserCircle }]
          : []),
        { name: t("settings"), href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 h-screen bg-[#001B3A] dark:bg-[#050A14] text-slate-200 border-r border-white/10 transition-[width] duration-200 ease-out select-none",
        collapsed ? "w-[76px]" : "w-[260px]"
      )}
    >
      {/* Top Signature Brand Header */}
      <div
        className={cn(
          "flex items-center h-16 shrink-0 border-b border-white/10",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <Link href="/" className="min-w-0">
          <BrandLogo variant={collapsed ? "icon" : "compact"} inverted />
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            title="Collapse sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categorized Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400/75">
                {section.label}
              </p>
            )}
            {section.items.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname?.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={collapsed ? link.name : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl text-[13.5px] font-medium transition-all duration-150",
                    collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                    isActive
                      ? "bg-white/[0.12] text-white shadow-xs"
                      : "text-slate-300/80 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {/* Signature Emerald Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#4ADE80]" />
                  )}
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-colors",
                      isActive
                        ? "text-[#6EE787]"
                        : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  {!collapsed && <span className="truncate flex-1">{link.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Expand Toggle when Collapsed */}
      {collapsed && (
        <div className="px-3 pb-2 flex justify-center">
          <button
            type="button"
            onClick={toggleCollapsed}
            title="Expand sidebar"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Executive Profile & Sign Out Footer */}
      <div className="shrink-0 border-t border-white/10 p-3 space-y-1.5 bg-black/15">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-xl p-2 hover:bg-white/[0.07] transition-colors",
            collapsed && "justify-center"
          )}
        >
          <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-white/15 text-white flex items-center justify-center text-xs font-bold ring-1 ring-[#6EE787]/40">
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
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">
                {name || "User"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {role === "ADMIN" ? "Administrator" : email || "Resident"}
              </p>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? t("logout") : undefined}
          className={cn(
            "flex items-center gap-2.5 rounded-xl text-[13px] font-medium text-rose-300/90 hover:text-rose-200 hover:bg-rose-500/15 transition-colors w-full cursor-pointer",
            collapsed ? "justify-center p-2.5" : "px-3 py-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{t("logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
