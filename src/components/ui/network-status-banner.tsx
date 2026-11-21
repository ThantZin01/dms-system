"use client";

import { useEffect, useRef, useState } from "react";
import { WifiOff } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const wasOfflineRef = useRef(false);
  const router = useRouter();
  const t = useTranslations("PWA");

  useEffect(() => {
    const syncStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (offline) {
        wasOfflineRef.current = true;
      }
    };

    const handleOffline = () => {
      wasOfflineRef.current = true;
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        toast.success(t("backOnline"));
        router.refresh();
      }
    };

    syncStatus();
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [router, t]);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>{t("offlineBanner")}</span>
    </div>
  );
}
