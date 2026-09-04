

import { Save } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { ProfileForm } from "@/components/forms/profile-form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const t = await getTranslations("Settings");
  const tCommon = await getTranslations("Common");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          {t('title')}
        </h1>
        <p className="text-gray-500 mt-2">{t('description')}</p>
      </div>


      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-6">{t('profileSettings')}</h2>
            {user ? (
              <ProfileForm initialData={{ name: user.name || "", email: user.email || "", image: user.image }} />
            ) : (
              <p>{tCommon('loading')}</p>
            )}
        </div>
        
        <div className="rounded-3xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 mb-6">{t('preferences')}</h2>
            <div className="space-y-6 text-sm">
                <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('language')}</label>
                    <LanguageToggle />
                </div>
                <div>
                    <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('theme')}</label>
                    <ThemeToggle />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
