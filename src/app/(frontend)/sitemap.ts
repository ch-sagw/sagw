import type { MetadataRoute } from 'next';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenantSitemapEntries } from '@/utilities/getTenantRouteParams';

export const dynamic = 'force-dynamic';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
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

  const entries = (await Promise.all(tenants.docs.map((tenant) => getTenantSitemapEntries({
    payload,
    tenant,
  })))).flat();

  return entries.map((entry) => ({
    alternates: entry.alternates,
    lastModified: entry.lastModified,
    url: entry.absoluteUrl,
  }));
};

export default sitemap;
