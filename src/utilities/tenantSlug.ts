import type { TypedLocale } from 'payload';

export const collectLocalizedSlugValues = (slug: string | Record<string, string> | null | undefined): string[] => {
  if (!slug) {
    return [];
  }

  if (typeof slug === 'string') {
    return [slug];
  }

  return Object.values(slug)
    .filter((s): s is string => Boolean(s));
};

export const isSagwTenantSlug = (slug: string | Record<string, string> | null | undefined): boolean => collectLocalizedSlugValues(slug)
  .some((s) => s.toLowerCase() === 'sagw');

export const tenantSlugForLocale = (
  slug: string | Record<string, string> | null | undefined,
  locale: TypedLocale,
): string => {
  if (!slug) {
    return '';
  }

  if (typeof slug === 'string') {
    return slug;
  }

  return slug[locale] ?? slug.de ?? collectLocalizedSlugValues(slug)[0] ?? '';
};

export const formatTenantLabelForError = (tenant: {
  slug?: string | Record<string, string> | null;
  title?: string | Record<string, string> | null;
  id: string;
}): string => {
  const fromSlug = collectLocalizedSlugValues(tenant.slug);

  if (fromSlug[0]) {
    return fromSlug[0];
  }

  const t = tenant.title;

  if (typeof t === 'string' && t) {
    return t;
  }

  if (t && typeof t === 'object') {
    const first = Object.values(t)
      .find((v) => typeof v === 'string' && v);

    if (first) {
      return first;
    }
  }

  return tenant.id;
};
