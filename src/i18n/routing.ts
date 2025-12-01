import { defineRouting } from 'next-intl/routing';
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
