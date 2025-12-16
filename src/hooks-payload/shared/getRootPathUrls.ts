import type { InterfacePageUrls } from '@/payload-types';
import { localizationConfig } from '@/i18n/payloadConfig';

// Generates root path URLs for each locale (fallback for deleted/missing links)
export const getRootPathUrls = (): InterfacePageUrls => {
  const rootPathUrls: InterfacePageUrls = {} as InterfacePageUrls;

  for (const locale of localizationConfig.locales) {
    const code = typeof locale === 'object' && 'code' in locale
      ? locale.code
      : locale;

    rootPathUrls[code as keyof InterfacePageUrls] = `${code}/`;
  }

  return rootPathUrls;
};

