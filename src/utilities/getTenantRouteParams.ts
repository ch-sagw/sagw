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
import type { Config } from '@/payload-types';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';

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
  pages: unknown[];
  tenant: InterfaceTenantRouteTenant;
}): InterfaceTenantRouteParam[] => {
  const pageParams: InterfaceTenantRouteParam[] = [];

  for (const page of pages) {
    const pageRecord = page as Record<string, unknown>;
    const breadcrumb = pageRecord[fieldBreadcrumbFieldName];
    const pageSlug = typeof pageRecord.slug === 'string'
      ? pageRecord.slug
      : (pageRecord.slug as Record<string, string> | undefined)?.[locale];

    if (pageSlug) {
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

export const getTenantRoutePath = ({
  locale,
  slug,
}: {
  locale: TypedLocale;
  slug: string[];
}): string => `/${locale}${slug.length > 0
  ? `/${slug.join('/')}`
  : ''}`;

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
      const whereConditions: Where[] = [
        {
          tenant: {
            equals: tenant.id,
          },
        },
      ];

      if (hasDrafts) {
        whereConditions.unshift({
          /* eslint-disable @typescript-eslint/naming-convention */
          _status: {
          /* eslint-enable @typescript-eslint/naming-convention */
            equals: 'published',
          },
        });
      }

      const pages = await payload.find({
        collection: collectionConfig.slug,
        depth: 1,
        limit: 0,
        locale,
        overrideAccess: true,
        pagination: false,
        where: {
          and: whereConditions,
        },
      });

      return processPagesForParams({
        isSagw,
        locale,
        pages: pages.docs,
        tenant,
      });
    } catch {
      return [];
    }
  }));

  params.push(...(await Promise.all(allFetchPromises)).flat());

  return params;
};

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
