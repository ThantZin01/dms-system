"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Menu, X, LayoutDashboard, Users, Trash2, Banknote, Receipt, Settings, UserCircle, Droplet, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function MobileNav({ role, name }: { role?: string, name?: string }) {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
              <span className="font-bold text-lg">DM</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Dormitory
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            const isActuallyActive = link.href === "/" ? pathname === "/" : isActive;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200",
                  isActuallyActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <Icon className={cn("h-5 w-5", isActuallyActive ? "text-indigo-600 dark:text-indigo-400" : "")} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold uppercase">
              {name ? name.charAt(0) : "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{name || "User"}</span>
              <span className="text-xs text-gray-500">{role === "ADMIN" ? "System Manager" : "Student"}</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
