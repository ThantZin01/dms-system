"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { LayoutDashboard, Users, Trash2, Banknote, Receipt, Settings, UserCircle, Droplet, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function Sidebar({ role, name }: { role?: string, name?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Sidebar");
  
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };
  
  const links = [
    { name: t("dashboard"), href: "/", icon: LayoutDashboard },
    { name: t("people"), href: "/people", icon: Users },
    { name: t("garbage"), href: "/garbage", icon: Trash2 },
    { name: t("fees"), href: "/fees", icon: Banknote },
    { name: t("expenses"), href: "/expenses", icon: Receipt },
    { name: "Water Bottles", href: "/water", icon: Droplet },
    ...(role === "ADMIN" ? [{ name: t("accounts"), href: "/accounts", icon: UserCircle }] : []),
    { name: t("settings"), href: "/settings", icon: Settings },
  ];

  return (
    <div className="hidden md:flex w-64 flex-col rounded-3xl bg-white/70 shadow-2xl backdrop-blur-xl border border-white/20 dark:bg-black/50 dark:border-white/10 px-4 py-8 relative">
      <div className="flex items-center gap-3 px-3 mb-10">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <span className="font-bold text-lg">DM</span>
        </div>
        <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          Dormitory
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          // Exact match for root
          const isActuallyActive = link.href === "/" ? pathname === "/" : isActive;
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium transition-all duration-300",
                isActuallyActive
                  ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm"
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white hover:translate-x-1"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  isActuallyActive ? "text-indigo-600 dark:text-indigo-400" : ""
                )} 
              />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold uppercase">
              {name ? name.charAt(0) : "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-[120px]" title={name || "User"}>{name || "User"}</span>
              <span className="text-xs text-gray-500">{role === "ADMIN" ? "System Manager" : "Student"}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 w-full"
          >
            <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
