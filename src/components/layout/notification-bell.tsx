"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { getUserNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

type BadgingNavigator = Navigator & {
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      try {
        const res = await getUserNotifications();
        if (active && res.data) {
          setNotifications(res.data);
        }
      } catch {
        // Silently skip transient network errors while polling
      }
    };

    void loadNotifications();
    const interval = setInterval(() => {
      void loadNotifications();
    }, 30000);
    const handleVisibilityOrOnline = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        void loadNotifications();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityOrOnline);
    window.addEventListener("online", handleVisibilityOrOnline);
    return () => {
      active = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityOrOnline);
      window.removeEventListener("online", handleVisibilityOrOnline);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Sync unread count with OS PWA App Badge API when supported
  useEffect(() => {
    const nav = navigator as BadgingNavigator;
    if (unreadCount > 0 && typeof nav.setAppBadge === "function") {
      nav.setAppBadge(unreadCount).catch(() => {});
    } else if (unreadCount === 0 && typeof nav.clearAppBadge === "function") {
      nav.clearAppBadge().catch(() => {});
    }
  }, [unreadCount]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllAsRead();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 md:border-[var(--border)] bg-white/10 md:bg-[var(--surface)] text-white md:text-[var(--muted-foreground)] hover:bg-white/20 md:hover:text-[var(--foreground)] md:hover:bg-[var(--muted)] transition-colors cursor-pointer"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#146B26] px-1 text-[10px] font-bold text-white ring-2 ring-[var(--surface)] tabular-nums">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed left-3 right-3 top-[calc(4rem+env(safe-area-inset-top))] md:absolute md:left-auto md:right-0 md:top-full md:mt-2 md:w-96 surface-elevated rounded-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--foreground)]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#EAF1F8] dark:bg-[#2D7DD2]/20 px-2 py-0.5 text-[10px] font-bold text-[#002B5B] dark:text-[#7BB8F7] tabular-nums">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#002B5B] dark:text-[#7BB8F7] hover:underline cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">
                    All caught up. No notifications yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 flex items-start gap-3 transition-colors",
                        !notification.isRead
                          ? "bg-[#EAF1F8]/55 dark:bg-[#2D7DD2]/10"
                          : "hover:bg-[var(--muted)]/50"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 rounded-full shrink-0",
                          !notification.isRead ? "bg-[#146B26] dark:bg-[#4ADE80]" : "bg-transparent"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--foreground)] leading-snug">
                          {notification.title}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed break-words">
                          {notification.message}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 mt-1.5">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-[var(--surface)] hover:text-[#146B26] dark:hover:text-[#4ADE80] transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
