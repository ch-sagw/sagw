import 'server-only';

// strips the locale prefix and returns URL segments used for tenant / page
// slug resolution (same shape as `[...slug]`).
export const parsePathAfterLocale = (
  pathname: string,
  locales: readonly string[],
): string[] => {
  const normalized = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  for (const loc of locales) {
    const prefix = `/${loc}`;

    if (normalized === prefix) {
      return [];
    }

    if (normalized.startsWith(`${prefix}/`)) {
      const rest = normalized.slice(prefix.length + 1);

      return rest
        ? rest.split('/')
          .filter(Boolean)
        : [];
    }
  }

  return normalized === '/' || normalized === ''
    ? []
    : normalized.split('/')
      .filter(Boolean);
};
