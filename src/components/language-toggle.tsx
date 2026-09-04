"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-4 items-center h-[50px]">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 border-2 shadow-sm ${
          locale === 'en' 
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-2 ring-emerald-500/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('my')}
        className={`px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 border-2 shadow-sm ${
          locale === 'my' 
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-2 ring-emerald-500/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Burmese
      </button>
    </div>
  );
}
