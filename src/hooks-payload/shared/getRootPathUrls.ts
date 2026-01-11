import type { Config } from '@/payload-types';

type LocalizedString = Partial<Record<Config['locale'], string>>;

// locale codes extracted from i18n config (client-safe, no server dependencies)
const LOCALE_CODES: Config['locale'][] = [
  'de',
  'en',
  'fr',
  'it',
];

// Returns root path URLs for all locales
export const getRootPathUrls = (): LocalizedString => Object.fromEntries(LOCALE_CODES.map((code) => [
  code,
  `/${code}`,
])) as LocalizedString;
