import 'server-only';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { getBreadcrumbPathSegments } from '@/utilities/getBreadcrumbPathSegments';
import {
  setsSlugs, singletonSlugs,
} from '@/collections/Pages/constants';
import type { Config } from '@/payload-types';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';

// helper function to process pages and build slug params
const processPagesForParams = ({
  pages,
  locale,
  isSagw,
  tenantSlug,
  tenantSlugRecord,
}: {
  pages: any[];
  locale: string;
  isSagw: boolean;
  tenantSlug: string | null;
  tenantSlugRecord: string | Record<string, string> | undefined;
}): { locale: string; slug: string[] }[] => {
  const pageParams: { locale: string; slug: string[] }[] = [];

  for (const page of pages) {
    const pageRecord = page as unknown as Record<string, unknown>;
    const breadcrumb = (pageRecord[fieldBreadcrumbFieldName] ?? []) as any;
    const pageSlug = typeof pageRecord.slug === 'string'
      ? pageRecord.slug
      : (pageRecord.slug as Record<string, string>)?.[locale];

    if (pageSlug) {
      // Get path segments from breadcrumb
      const pathSegments = getBreadcrumbPathSegments({
        breadcrumb,
        locale: locale as Config['locale'],
      });

      // Build full slug array
      const fullSlug = [
        ...pathSegments,
        pageSlug,
      ];

      // For SAGW tenant: /locale/page-slug1/page-slug2
      if (isSagw) {
        pageParams.push({
          locale,
          slug: fullSlug,
        });
      } else if (tenantSlug) {
        // For non-SAGW tenant: /locale/tenant-slug/page-slug1/page-slug2
        const localeTenantSlug = typeof tenantSlugRecord === 'string'
          ? tenantSlugRecord
          : tenantSlugRecord?.[locale] || tenantSlug;

        if (localeTenantSlug) {
          pageParams.push({
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

// Generate static params for all dynamic routes
export const generateStaticParams = async (): Promise<{ locale: TypedLocale; slug: string[] }[]> => {

  // we don't want to run into issues with playwright where we create pages
  // on the fly...
  if (process.env.NODE_ENV !== 'production') {
    return [];
  }

  const payload = await getPayloadCached();

  // fetch tenants
  const tenants = await payload.find({
    collection: 'tenants',
    depth: 0,
    locale: 'all',
    overrideAccess: true,
  });

  if (tenants.docs.length === 0) {
    return [];
  }

  // tenants promises
  const allFetchPromises: Promise<{ locale: string; slug: string[] }[]>[] = [];
  const locales = getLocaleCodes();
  const params: { locale: string; slug: string[] }[] = [];

  for (const tenant of tenants.docs) {
    const tenantLanguages = tenant.languages;

    // determine enabled locales for this tenant
    const enabledLocales = tenantLanguages
      ? locales.filter((locale) => tenantLanguages[locale as keyof typeof tenantLanguages])
      : locales;

    // tenant name (should be an object, but also handle string case)
    const tenantName = typeof tenant.name === 'string'
      ? tenant.name
      : (tenant.name as any)?.de || tenant.name;
    const isSagw = tenantName?.toLowerCase() === 'sagw';

    // get tenant slug (localized)
    const tenantSlugRecord = tenant.slug as string | Record<string, string> | undefined;
    const tenantSlug = typeof tenantSlugRecord === 'string'
      ? tenantSlugRecord
      : tenantSlugRecord?.de || null;

    // for non-SAGW tenants, add home page route: /locale/tenant-slug
    if (!isSagw && tenantSlug) {
      for (const locale of enabledLocales) {
        const localeTenantSlug = typeof tenantSlugRecord === 'string'
          ? tenantSlugRecord
          : tenantSlugRecord?.[locale] || tenantSlug;

        if (localeTenantSlug) {
          params.push({
            locale,
            slug: [localeTenantSlug],
          });
        }
      }
    }

    // all published & linkable pages for this tenant
    const pageCollections = [
      ...setsSlugs,
      ...singletonSlugs.filter((s) => s.linkable),
    ];

    // create fetch promises for this tenant
    const tenantFetchPromises = pageCollections.flatMap((collectionConfig) => enabledLocales.map(async (locale) => {
      try {
        // build where clause conditionally based on whether drafts are enabled
        const collectionConfigObj = payload.config.collections.find((c) => c.slug === collectionConfig.slug);
        const hasDrafts = Boolean(collectionConfigObj?.versions?.drafts);
        const whereConditions: any[] = [
          {
            tenant: {
              equals: tenant.id,
            },
          },
        ];

        // only add _status filter if collection has drafts enabled
        if (hasDrafts) {
          whereConditions.unshift({
            /* eslint-disable @typescript-eslint/naming-convention */
            _status: {
            /* eslint-enable @typescript-eslint/naming-convention */
              equals: 'published',
            },
          });
        }

        // fetch pages for the specific locale
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

        // build slug arrays from page breadcrumbs for this locale
        const pageParams = processPagesForParams({
          isSagw,
          locale,
          pages: pages.docs,
          tenantSlug,
          tenantSlugRecord,
        });

        return pageParams;
      } catch {
        // collection might not exist or have different structure, skip
        return [];
      }
    }));

    allFetchPromises.push(...tenantFetchPromises);
  }

  // collect results
  const allPageParamsResults = await Promise.all(allFetchPromises);

  params.push(...allPageParamsResults.flat());

  // log generated paths
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.log(`\n📦 Generated ${params.length} static paths for [locale]/[...slug]:`);
    params.forEach((param) => {
      const path = `/${param.locale}${param.slug.length > 0
        ? `/${param.slug.join('/')}`
        : ''}`;

      console.log(`  ${path}`);
    });
    console.log('');
  }

  return params as { locale: TypedLocale; slug: string[] }[];
};
