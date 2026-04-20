import type {
  BasePayload, TypedLocale, Where,
} from 'payload';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { getBreadcrumbPathSegments } from '@/utilities/getBreadcrumbPathSegments';
import {
  getTenantName, getTenantSlugForLocale,
} from '@/utilities/tenant';
import {
  setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import { homeSlug } from '@/collections/constants';
import type { Config } from '@/payload-types';
import {
  buildBreadcrumbsForDoc, InterfaceBreadcrumb,
} from '@/utilities/buildBreadcrumbs';

interface InterfaceTenantRouteTenant {
  id: string;
  languages?: Partial<Record<Config['locale'], boolean | null>> | null;
  name?: string | Partial<Record<Config['locale'], string>>;
  slug?: string | Partial<Record<Config['locale'], string>>;
}

interface InterfaceTenantRouteParam {
  isHome: boolean;
  locale: TypedLocale;
  slug: string[];
}

export interface InterfaceTenantSitemapStaticParam {
  absoluteUrl: string;
  alternates: {
    languages: Partial<Record<TypedLocale, string>>;
  };
  isHome: boolean;
  lastModified?: Date;
  locale: TypedLocale;
  pathname: string;
  slug: string[];
}

interface InterfaceTenantSitemapVariant extends InterfaceTenantRouteParam {
  absoluteUrl: string;
  isIndexable: boolean;
  key: string;
  lastModified?: Date;
  pathname: string;
}

interface InterfaceGroupedSitemapEntry {
  alternates: Partial<Record<TypedLocale, string>>;
  variants: InterfaceTenantSitemapVariant[];
}

interface InterfaceTenantRoutePageDocument {
  id: string;
  meta?: {
    seo?: {
      index?: boolean | null;
    } | null;
  } | null;
  slug?: string | Partial<Record<Config['locale'], string>> | null;
  updatedAt?: string | null;
}

type PageWithBreadcrumb = InterfaceTenantRoutePageDocument & {
  breadcrumb: InterfaceBreadcrumb;
};

const getEnabledLocales = (tenant: InterfaceTenantRouteTenant): TypedLocale[] => {
  const locales = getLocaleCodes();

  if (!tenant.languages) {
    return locales;
  }

  return locales.filter((locale) => tenant.languages?.[locale]);
};

const processPagesForParams = ({
  isSagw,
  locale,
  pages,
  tenant,
}: {
  isSagw: boolean;
  locale: TypedLocale;
  pages: PageWithBreadcrumb[];
  tenant: InterfaceTenantRouteTenant;
}): InterfaceTenantRouteParam[] => {
  const pageParams: InterfaceTenantRouteParam[] = [];

  for (const page of pages) {
    const pageRecord = page as unknown as Record<string, unknown>;
    const {
      breadcrumb,
    } = page;
    const pageSlug = typeof pageRecord.slug === 'string'
      ? pageRecord.slug
      : (pageRecord.slug as Record<string, string> | undefined)?.[locale];

    if (pageSlug && pageSlug !== homeSlug) {
      const pathSegments = getBreadcrumbPathSegments({
        breadcrumb: (breadcrumb ?? []) as any,
        locale,
      });
      const fullSlug = [
        ...pathSegments,
        pageSlug,
      ];

      if (isSagw) {
        pageParams.push({
          isHome: false,
          locale,
          slug: fullSlug,
        });
      } else {
        const localeTenantSlug = getTenantSlugForLocale({
          locale,
          slug: tenant.slug,
        });

        if (localeTenantSlug) {
          pageParams.push({
            isHome: false,
            locale,
            slug: [
              localeTenantSlug,
              ...fullSlug,
            ],
          });
        }
      }
    }
  }

  return pageParams;
};

const getLastModified = (updatedAt?: string | null): Date | undefined => {
  if (!updatedAt) {
    return undefined;
  }

  const lastModified = new Date(updatedAt);

  return Number.isNaN(lastModified.valueOf())
    ? undefined
    : lastModified;
};

const SITEMAP_CANONICAL_ORIGIN = 'https://www.sagw.ch';

const getSitemapCanonicalAbsoluteUrl = (pathname: string): string => {
  const origin = SITEMAP_CANONICAL_ORIGIN.replace(/\/+$/u, '');

  return new URL(pathname, `${origin}/`).href;
};

const getTenantWhere = ({
  hasDrafts,
  tenantId,
}: {
  hasDrafts: boolean;
  tenantId: string;
}): {
  and: Where[];
} => ({
  and: [
    ...(hasDrafts
      ? [
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          _status: {
          /* eslint-enable @typescript-eslint/naming-convention */
            equals: 'published',
          },
        } as Where,
      ]
      : []),
    {
      tenant: {
        equals: tenantId,
      },
    },
  ],
});

const addGroupedSitemapVariant = ({
  entryMap,
  variant,
}: {
  entryMap: Map<string, InterfaceGroupedSitemapEntry>;
  variant: InterfaceTenantSitemapVariant;
}): void => {
  const groupedEntry = entryMap.get(variant.key);

  if (groupedEntry) {
    groupedEntry.variants.push(variant);
    groupedEntry.alternates[variant.locale] = variant.absoluteUrl;

    return;
  }

  entryMap.set(variant.key, {
    alternates: {
      [variant.locale]: variant.absoluteUrl,
    },
    variants: [variant],
  });
};

// used by cache invalidation routine
export const getTenantRoutePath = ({
  locale,
  slug,
}: {
  locale: TypedLocale;
  slug: string[];
}): string => `/${locale}${slug.length > 0
  ? `/${slug.join('/')}`
  : ''}`;

const buildSitemapVariant = ({
  isIndexable,
  key,
  param,
  updatedAt,
}: {
  isIndexable: boolean;
  key: string;
  param: InterfaceTenantRouteParam;
  updatedAt?: string | null;
}): InterfaceTenantSitemapVariant => {
  const pathname = getTenantRoutePath(param);

  return {
    absoluteUrl: getSitemapCanonicalAbsoluteUrl(pathname),
    isHome: param.isHome,
    isIndexable,
    key,
    lastModified: getLastModified(updatedAt),
    locale: param.locale,
    pathname,
    slug: param.slug,
  };
};

// used by cache invalidation routine (via `getTenantRoutePaths`)
export const getTenantRouteParams = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: InterfaceTenantRouteTenant;
}): Promise<InterfaceTenantRouteParam[]> => {
  const params: InterfaceTenantRouteParam[] = [];
  const enabledLocales = getEnabledLocales(tenant);
  const isSagw = getTenantName({
    name: tenant.name,
  })
    ?.toLowerCase() === 'sagw';

  if (isSagw) {
    params.push(...enabledLocales.map((locale) => ({
      isHome: true,
      locale,
      slug: [],
    })));
  } else {
    params.push(...enabledLocales.flatMap((locale) => {
      const tenantSlug = getTenantSlugForLocale({
        locale,
        slug: tenant.slug,
      });

      if (!tenantSlug) {
        return [];
      }

      return [
        {
          isHome: true,
          locale,
          slug: [tenantSlug],
        },
      ];
    }));
  }

  const pageCollections = [
    ...setsSlugs,
    ...singletonSlugs.filter((slug) => slug.linkable),
  ];

  const allFetchPromises = pageCollections.flatMap((collectionConfig) => enabledLocales.map(async (locale) => {
    try {
      const collectionConfigObj = payload.config.collections.find((collection) => collection.slug === collectionConfig.slug);
      const hasDrafts = Boolean(collectionConfigObj?.versions?.drafts);

      const pages = await payload.find({
        collection: collectionConfig.slug,
        depth: 1,
        limit: 0,
        locale,
        overrideAccess: true,
        pagination: false,
        where: getTenantWhere({
          hasDrafts,
          tenantId: tenant.id,
        }),
      });

      const pagesWithBreadcrumbs = await Promise.all(pages.docs.map(async (page) => {
        const breadcrumb = await buildBreadcrumbsForDoc({
          doc: page as unknown as Record<string, unknown>,
          payload,
        });

        return {
          ...(page as unknown as InterfaceTenantRoutePageDocument),
          breadcrumb,
        } as PageWithBreadcrumb;
      }));

      return processPagesForParams({
        isSagw,
        locale,
        pages: pagesWithBreadcrumbs,
        tenant,
      });
    } catch {
      return [];
    }
  }));

  params.push(...(await Promise.all(allFetchPromises)).flat());

  return params;
};

// used by sitemap generation
export const getTenantSitemapEntries = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: InterfaceTenantRouteTenant;
}): Promise<InterfaceTenantSitemapStaticParam[]> => {
  const enabledLocales = getEnabledLocales(tenant);

  if (enabledLocales.length === 0) {
    return [];
  }

  const isSagw = getTenantName({
    name: tenant.name,
  })
    ?.toLowerCase() === 'sagw';
  const entryMap = new Map<string, InterfaceGroupedSitemapEntry>();

  const homeEntries = await Promise.all(enabledLocales.map(async (locale) => {
    const homePage = await payload.find({
      collection: 'homePage',
      depth: 0,
      limit: 1,
      locale,
      overrideAccess: true,
      where: getTenantWhere({
        hasDrafts: true,
        tenantId: tenant.id,
      }),
    });
    const [page] = homePage.docs as InterfaceTenantRoutePageDocument[];

    if (!page) {
      return null;
    }

    const param = isSagw
      ? {
        isHome: true,
        locale,
        slug: [],
      }
      : ((): InterfaceTenantRouteParam | null => {
        const tenantSlug = getTenantSlugForLocale({
          locale,
          slug: tenant.slug,
        });

        if (!tenantSlug) {
          return null;
        }

        return {
          isHome: true,
          locale,
          slug: [tenantSlug],
        };
      })();

    if (!param) {
      return null;
    }

    return buildSitemapVariant({
      isIndexable: Boolean(page.meta?.seo?.index),
      key: `${tenant.id}:homePage:${page.id}`,
      param,
      updatedAt: page.updatedAt,
    });
  }));

  homeEntries
    .filter((entry): entry is InterfaceTenantSitemapVariant => Boolean(entry))
    .forEach((entry) => {
      addGroupedSitemapVariant({
        entryMap,
        variant: entry,
      });
    });

  const pageCollections = [
    ...setsSlugs,
    ...singletonSlugs.filter((slug) => slug.linkable),
  ];

  const pageEntries = await Promise.all(pageCollections.flatMap((collectionConfig) => enabledLocales.map(async (locale) => {
    try {
      const collectionConfigObj = payload.config.collections.find((collection) => collection.slug === collectionConfig.slug);
      const hasDrafts = Boolean(collectionConfigObj?.versions?.drafts);
      const pages = await payload.find({
        collection: collectionConfig.slug,
        depth: 1,
        limit: 0,
        locale,
        overrideAccess: true,
        pagination: false,
        where: getTenantWhere({
          hasDrafts,
          tenantId: tenant.id,
        }),
      });

      const pagesWithBreadcrumbs = await Promise.all((pages.docs as InterfaceTenantRoutePageDocument[]).map(async (page) => {
        const breadcrumb = await buildBreadcrumbsForDoc({
          doc: page as unknown as Record<string, unknown>,
          payload,
        });

        return {
          ...page,
          breadcrumb,
        } as PageWithBreadcrumb;
      }));

      return pagesWithBreadcrumbs
        .flatMap((page) => {
          const params = processPagesForParams({
            isSagw,
            locale,
            pages: [page],
            tenant,
          });
          const [param] = params;

          if (!param) {
            return [];
          }

          return [
            buildSitemapVariant({
              isIndexable: Boolean(page.meta?.seo?.index),
              key: `${tenant.id}:${collectionConfig.slug}:${page.id}`,
              param,
              updatedAt: page.updatedAt,
            }),
          ];
        });
    } catch {
      return [];
    }
  })));

  pageEntries
    .flat()
    .forEach((entry) => {
      addGroupedSitemapVariant({
        entryMap,
        variant: entry,
      });
    });

  return Array.from(entryMap.values())
    .flatMap((groupedEntry) => groupedEntry.variants
      .filter((variant) => variant.isIndexable)
      .map((variant) => ({
        absoluteUrl: variant.absoluteUrl,
        alternates: {
          languages: groupedEntry.alternates,
        },
        isHome: variant.isHome,
        lastModified: variant.lastModified,
        locale: variant.locale,
        pathname: variant.pathname,
        slug: variant.slug,
      })));
};

// used by cache invalidation routine
export const getTenantRoutePaths = async ({
  payload,
  tenant,
}: {
  payload: BasePayload;
  tenant: InterfaceTenantRouteTenant;
}): Promise<string[]> => {
  const params = await getTenantRouteParams({
    payload,
    tenant,
  });

  return [...new Set(params.map((param) => getTenantRoutePath(param)))];
};
