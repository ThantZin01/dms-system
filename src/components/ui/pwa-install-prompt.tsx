"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./button";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  Share,
  PlusSquare,
  Smartphone,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  variant?: "outline" | "subtle";
  mode?: "button" | "card";
}

function subscribeStandalone(callback: () => void) {
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener?.("change", callback);
  window.addEventListener("appinstalled", callback);
  return () => {
    mediaQuery.removeEventListener?.("change", callback);
    window.removeEventListener("appinstalled", callback);
  };
}

function getStandaloneSnapshot(): boolean {
  return Boolean(
    window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
}

function getIOSSnapshot(): boolean {
  const ua = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

const emptySubscribe = () => () => {};

export function PWAInstallPrompt({
  variant = "outline",
  mode = "button",
}: PWAInstallPromptProps) {
  const t = useTranslations("PWA");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installedLocally, setInstalledLocally] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  const isStandaloneStore = useSyncExternalStore<boolean | null>(
    subscribeStandalone,
    getStandaloneSnapshot,
    () => null
  );
  const isIOS = useSyncExternalStore(emptySubscribe, getIOSSnapshot, () => false);
  const isStandalone = installedLocally ? true : isStandaloneStore;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setInstalledLocally(true);
      setShowIOSGuide(false);
      toast.success(t("installSuccess"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [t]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
      return;
    }

    if (isIOS) {
      setShowIOSGuide((prev) => !prev);
      return;
    }

    toast(t("browserMenuHint"), { duration: 4500 });
  };

  const handleCheckForUpdates = async () => {
    setCheckingUpdate(true);
    try {
      if (!("serviceWorker" in navigator)) {
        toast(t("upToDate"));
        return;
      }
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        toast(t("upToDate"));
        return;
      }
      await registration.update();
      if (registration.waiting || registration.installing) {
        toast.success(t("updateAvailable"));
        setTimeout(() => window.location.reload(), 900);
      } else {
        toast.success(t("upToDate"));
      }
    } catch {
      toast(t("upToDate"));
    } finally {
      setCheckingUpdate(false);
    }
  };

  if (isStandalone === null) {
    return null;
  }

  if (isStandalone) {
    if (mode === "button") return null;

    return (
      <div className="pt-4 border-t border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF6ED] dark:bg-[#2CA548]/15 text-[#146B26] dark:text-[#4ADE80]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-[var(--foreground)]">
                {t("installedBadge")}
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {t("installedDescription")}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCheckForUpdates}
          disabled={checkingUpdate}
          variant="outline"
          className="w-full"
          type="button"
        >
          <RefreshCw
            className={`h-4 w-4 ${checkingUpdate ? "animate-spin" : ""}`}
          />
          {checkingUpdate ? t("checkingUpdates") : t("checkUpdates")}
        </Button>
      </div>
    );
  }

  const iosGuidePanel = showIOSGuide && (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 p-3.5 text-left space-y-2 text-xs">
      <p className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
        <Smartphone className="h-3.5 w-3.5 text-[#002B5B] dark:text-[#7BB8F7]" />
        {t("iosInstructionsTitle")}
      </p>
      <ol className="space-y-1.5 text-[var(--muted-foreground)] list-decimal list-inside">
        <li className="leading-snug">
          <Share className="inline h-3.5 w-3.5 mr-1 text-[#002B5B] dark:text-[#7BB8F7] align-text-bottom" />
          {t("iosStep1")}
        </li>
        <li className="leading-snug">
          <PlusSquare className="inline h-3.5 w-3.5 mr-1 text-[#146B26] dark:text-[#4ADE80] align-text-bottom" />
          {t("iosStep2")}
        </li>
        <li className="leading-snug">{t("iosStep3")}</li>
      </ol>
    </div>
  );

  if (mode === "card") {
    return (
      <div className="pt-4 border-t border-[var(--border)] space-y-2.5">
        <p className="text-xs font-semibold text-[var(--foreground)]">
          {t("installTitle")}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          {t("installDescription")}
        </p>
        <Button
          onClick={handleInstallClick}
          variant={variant}
          className="w-full"
          type="button"
        >
          <Download className="h-4 w-4" />
          {t("installButton")}
        </Button>
        {iosGuidePanel}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <Button
        onClick={handleInstallClick}
        variant={variant}
        className="w-full"
        type="button"
      >
        <Download className="h-4 w-4" />
        {t("installButton")}
      </Button>
      {iosGuidePanel}
    </div>
  );
}
