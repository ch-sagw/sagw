import type { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  getTenantRouteParams,
  getTenantSitemapEntries,
  type InterfaceTenantSitemapStaticParam,
} from '@/utilities/getTenantRouteParams';

interface InterfaceGenerateStaticParamsOptions {
  ignoreEnvGuard?: boolean;
  mode?: 'route' | 'sitemap';
}

interface InterfaceGenerateStaticParams {
  (): Promise<{ locale: TypedLocale; slug: string[] }[]>;
  (options: { ignoreEnvGuard: true; mode?: 'route' }): Promise<{ locale: TypedLocale; slug: string[] }[]>;
  (options: { ignoreEnvGuard?: boolean; mode: 'route' }): Promise<{ locale: TypedLocale; slug: string[] }[]>;
  (options: { mode: 'sitemap' }): Promise<InterfaceTenantSitemapStaticParam[]>;
}

// Generate static params for all dynamic routes
const generateStaticParamsImpl = async (options?: InterfaceGenerateStaticParamsOptions): Promise<{ locale: TypedLocale; slug: string[] }[] | InterfaceTenantSitemapStaticParam[]> => {
  // we don't want to run into issues with playwright where we create pages
  // on the fly...
  if (options?.mode !== 'sitemap' && !options?.ignoreEnvGuard && process.env.NODE_ENV !== 'production') {
    return [];
  }

  const payload = await getPayloadCached();
  const tenants = await payload.find({
    collection: 'tenants',
    depth: 0,
    limit: 0,
    locale: 'all',
    overrideAccess: true,
    pagination: false,
  });

  if (tenants.docs.length === 0) {
    return [];
  }

  if (options?.mode === 'sitemap') {
    return (await Promise.all(tenants.docs.map((tenant) => getTenantSitemapEntries({
      payload,
      tenant,
    })))).flat();
  }

  const tenantParams = await Promise.all(tenants.docs.map((tenant) => getTenantRouteParams({
    payload,
    tenant,
  })));
  const params = tenantParams
    .flat()
    .map((param) => ({
      locale: param.locale,
      slug: param.slug,
    }));

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

// used for sitemap, static sites generation
export const generateStaticParams = generateStaticParamsImpl as InterfaceGenerateStaticParams;
