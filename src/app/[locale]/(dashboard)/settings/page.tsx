import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { PageHeader } from "@/components/ui/page-header";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { ProfileForm } from "@/components/forms/profile-form";

export default async function SettingsPage() {
  const [session, t, tCommon] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getTranslations("Settings"),
    getTranslations("Common"),
  ]);

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  const user = dbUser || session?.user;

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Account & Workspace"
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Profile & Security */}
        <section className="lg:col-span-7 surface-card rounded-2xl p-5 md:p-6">
          <div className="mb-5 pb-4 border-b border-[var(--border)]">
            <h2 className="text-base font-bold text-[var(--foreground)]">
              {t("profileSettings")}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Update your profile details, avatar photo, and login password.
            </p>
          </div>
          {user ? (
            <ProfileForm
              initialData={{
                name: user.name || "",
                email: user.email || "",
                image: user.image,
              }}
            />
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              {tCommon("loading")}
            </p>
          )}
        </section>

        {/* Workspace Preferences & PWA App */}
        <section className="lg:col-span-5 surface-card rounded-2xl p-5 md:p-6 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            <div className="pb-4 border-b border-[var(--border)]">
              <h2 className="text-base font-bold text-[var(--foreground)]">
                {t("preferences")}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Customize display theme and interface language.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                {t("theme")}
              </label>
              <ThemeToggle />
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                {t("language")}
              </label>
              <LanguageToggle />
            </div>
          </div>

          <PWAInstallPrompt variant="outline" mode="card" />
        </section>
      </div>
    </div>
  );
}
