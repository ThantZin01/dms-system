"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { getUserNotifications, markAsRead, markAllAsRead } from "@/actions/notifications";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const res = await getUserNotifications();
    if (res.data) {
      setNotifications(res.data);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-gray-900" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  You have no notifications.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 flex items-start gap-3 transition-colors ${
                        !notification.isRead 
                          ? "bg-indigo-50/50 dark:bg-indigo-500/5" 
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-words">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-indigo-500"
                          title="Mark as read"
                        >
                          <Check size={16} />
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
