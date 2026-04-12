import type { Config } from '@/payload-types';

type TenantLocalizedValue = string | Partial<Record<Config['locale'], string>> | null | undefined;

const getLocalizedTenantValue = ({
  locale,
  value,
}: {
  locale?: Config['locale'];
  value: TenantLocalizedValue;
}): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    if (locale && value[locale]) {
      return value[locale] || null;
    }

    return value.de || Object.values(value)
      .find(Boolean) || null;
  }

  return null;
};

export const getTenantName = ({
  name,
}: {
  name?: TenantLocalizedValue;
}): string | null => getLocalizedTenantValue({
  value: name,
});

export const getTenantSlugForLocale = ({
  locale,
  slug,
}: {
  locale: Config['locale'];
  slug?: TenantLocalizedValue;
}): string | null => getLocalizedTenantValue({
  locale,
  value: slug,
});
