import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { localizationConfig } from '@/i18n/payloadConfig';

export const routing = defineRouting({
  defaultLocale: localizationConfig.defaultLocale,
  locales: localizationConfig.locales.map((locale) => {
    if (typeof locale === 'object' && 'code' in locale) {
      return locale.code;
    }

    return locale;
  }),
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {
  Link, redirect, usePathname, useRouter,
} = createNavigation(routing);

// export type Locale = (typeof routing.locales)[number]
