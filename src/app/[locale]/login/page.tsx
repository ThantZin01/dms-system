"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  Sun,
  Moon,
  Globe,
  Loader2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "my" : "en" });
  };

  return (
    <div className="min-h-dvh lg:h-dvh lg:overflow-hidden w-full flex flex-col lg:grid lg:grid-cols-12 bg-[#F3F6FA] dark:bg-[#060B14]">
      {/* ===================================================================== */}
      {/* DESKTOP LEFT PANEL (50% Editorial Executive Brand Column)             */}
      {/* ===================================================================== */}
      <section className="hidden lg:flex lg:col-span-6 relative flex-col justify-between bg-[#001B3A] text-white px-12 py-10 xl:px-16 xl:py-12 overflow-hidden border-r border-white/10">
        {/* Subtle Architectural Grid & Soft Navy/Emerald Accent */}
        <div className="absolute inset-0 bg-luxury-grid opacity-55 pointer-events-none" />
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-[#0A4D8C]/35 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#146B26]/25 blur-3xl pointer-events-none" />

        {/* Top Emblem Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <BrandLogo variant="compact" inverted />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4ADE80]" />
            Private Portal
          </span>
        </div>

        {/* Center Editorial Statement */}
        <div className="relative z-10 max-w-lg my-auto">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="h-[2px] w-7 bg-[#2CA548]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6EE787]">
              Executive Residence Operations
            </span>
          </div>

          <h1 className="text-3xl xl:text-[40px] font-bold tracking-tight leading-[1.15] text-white">
            Quiet clarity for every room, duty, and shared ledger.
          </h1>
          <p className="mt-4 text-[14.5px] text-slate-300/90 leading-relaxed max-w-md">
            Centralized resident registry, automated duty rotation, drinking water
            inventory, and transparent 3-month fee & utility accounting.
          </p>

          {/* Clean Architectural Ledger Specification Row (No bulky generic boxes) */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6EE787]">
                01 • Residence
              </p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Rooms, contacts & active roster
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6EE787]">
                02 • Operations
              </p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Fair garbage turns & water stock
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6EE787]">
                03 • Finance
              </p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                3-month fees & per-person splits
              </p>
            </div>
          </div>
        </div>

        {/* Clean Bottom Metadata */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-5">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-[#4ADE80]" />
            Dormitory Management System
          </span>
          <span>Desktop & Mobile Edition</span>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* MOBILE TOP BRAND HEADER (< lg only — Native Hospitality App Feel)     */}
      {/* ===================================================================== */}
      <div className="lg:hidden relative bg-[#001B3A] text-white px-5 pt-4 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-luxury-grid opacity-45 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6EE787]">
            Residence Portal
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-white/10 border border-white/15 text-[11px] font-semibold text-white cursor-pointer"
            >
              <Globe className="h-3 w-3" />
              {locale === "en" ? "EN" : "MY"}
            </button>
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/10 border border-white/15 text-white cursor-pointer"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-300" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center mt-6">
          <BrandLogo variant="icon" className="h-14 w-14 rounded-2xl p-2 shadow-md" />
          <h1 className="text-xl font-bold tracking-tight mt-3">
            Dormitory Management
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Sign in to access your residence workspace
          </p>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* RIGHT PANEL (Desktop) / OVERLAPPING CARD (Mobile)                     */}
      {/* ===================================================================== */}
      <section className="flex-1 lg:col-span-6 flex flex-col justify-between px-4 pb-8 lg:px-10 lg:py-8">
        {/* Desktop Top Utility Bar */}
        <div className="hidden lg:flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-[#002B5B] dark:text-[#7BB8F7]" />
            {locale === "en" ? "English" : "မြန်မာ"}
          </button>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#002B5B]" />
            )}
          </button>
        </div>

        {/* Elevated Framed Sign-In Card */}
        <div className="w-full max-w-[420px] mx-auto -mt-10 lg:my-auto relative z-20">
          <div className="surface-elevated rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800">
            {/* Desktop Clean Full Logo Lockup (No ugly square box!) */}
            <div className="hidden lg:flex flex-col items-center text-center mb-7">
              <BrandLogo variant="full" className="mb-4" />
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                Sign in to your account
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Enter your authorized residence credentials below.
              </p>
            </div>

            {/* Mobile Card Header */}
            <div className="lg:hidden mb-5">
              <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                Welcome back
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Enter your email and password to continue.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full h-11 rounded-xl border border-slate-300/90 dark:border-slate-700 bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 focus:border-[#002B5B] dark:focus:border-[#2D7DD2] focus:outline-none focus:ring-2 focus:ring-[#002B5B]/15 dark:focus:ring-[#2D7DD2]/25 transition-colors"
                    placeholder="admin@dorm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full h-11 rounded-xl border border-slate-300/90 dark:border-slate-700 bg-[var(--surface)] pl-10 pr-11 text-sm text-[var(--foreground)] placeholder:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 focus:border-[#002B5B] dark:focus:border-[#2D7DD2] focus:outline-none focus:ring-2 focus:ring-[#002B5B]/15 dark:focus:ring-[#2D7DD2]/25 transition-colors"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-[var(--foreground)] transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 px-3.5 py-2.5">
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {error}
                  </p>
                </div>
              )}

              <div className="pt-2 space-y-2.5">
                <Button type="submit" disabled={loading} size="lg" className="w-full h-11">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <PWAInstallPrompt variant="subtle" />
              </div>
            </form>
          </div>
        </div>

        {/* Footer Caption */}
        <p className="text-center text-[11px] text-[var(--muted-foreground)] mt-6 lg:mt-0">
          Authorized residents & administrators only
        </p>
      </section>
    </div>
  );
}
