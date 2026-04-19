import type { Config } from '@/payload-types';

export type TenantLocalizedValue = string | Partial<Record<Config['locale'], string>> | null | undefined;

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

// returns the tenant's home URL for the given locale.
export const getTenantHomeUrl = ({
  locale,
  tenantSlug,
}: {
  locale: Config['locale'];
  tenantSlug?: TenantLocalizedValue;
}): string => {
  const slug = getTenantSlugForLocale({
    locale,
    slug: tenantSlug,
  });

  if (!slug || slug === 'sagw') {
    return `/${locale}`;
  }

  return `/${locale}/${slug}`;
};

// extracts the localized tenant slug record from a pageDoc's tenant
// relationship (populated with depth >= 1). returns undefined if the
// tenant is not populated on the doc.
export const getTenantSlugFromPageDoc = (pageDoc: Record<string, unknown> | null | undefined): TenantLocalizedValue => {
  if (!pageDoc) {
    return undefined;
  }

  const {
    tenant,
  } = pageDoc;

  if (tenant && typeof tenant === 'object' && 'slug' in tenant) {
    return tenant.slug as TenantLocalizedValue;
  }

  return undefined;
};

// convenience combining getTenantSlugFromPageDoc + getTenantSlugForLocale.
// returns the tenant slug string for the target locale, or null.
export const getTenantSlugForLocaleFromPageDoc = ({
  locale,
  pageDoc,
}: {
  locale: Config['locale'];
  pageDoc: Record<string, unknown> | null | undefined;
}): string | null => getTenantSlugForLocale({
  locale,
  slug: getTenantSlugFromPageDoc(pageDoc),
});
