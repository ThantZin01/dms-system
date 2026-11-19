"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Download } from "lucide-react";
import { toast } from "react-hot-toast";

export function PWAInstallPrompt({ variant = "outline" }: { variant?: "outline" | "subtle" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
    setIsStandalone(Boolean(standalone));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast("Use your browser menu to install this app on your device.");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (isStandalone) return null;

  return (
    <Button
      onClick={handleInstallClick}
      variant={variant}
      className="w-full"
      type="button"
    >
      <Download className="h-4 w-4" />
      Install Mobile & Desktop App
    </Button>
  );
}
