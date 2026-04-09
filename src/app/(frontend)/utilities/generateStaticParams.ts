import 'server-only';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantRouteParams } from '@/app/(frontend)/utilities/getTenantRouteParams';

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

  const tenantParams = await Promise.all(tenants.docs.map((tenant) => getTenantRouteParams({
    payload,
    tenant,
  })));

  const params = tenantParams
    .flat()
    .filter((param) => param.slug.length > 0)
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
