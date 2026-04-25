import type { BasePayload } from 'payload';
import { getTenantRoutePaths } from '@/utilities/getTenantRouteParams';
import { revalidatePath } from 'next/cache.js';

export const invalidateCache = async ({
  includeDrafts,
  logCacheInvalidation = false,
  payload,
  tenantId,
}: {
  includeDrafts?: boolean;
  logCacheInvalidation?: boolean;
  payload: BasePayload;
  tenantId?: string | null;
}): Promise<void> => {
  if (!payload || !tenantId) {
    return;
  }

  try {
    const tenant = await payload.findByID({
      collection: 'tenants',
      depth: 0,
      id: tenantId,
      locale: 'all',
      overrideAccess: true,
    });

    const paths = await getTenantRoutePaths({
      includeDrafts,
      payload,
      tenant: {
        id: tenant.id,
        languages: tenant.languages,
        slug: typeof tenant.slug === 'string'
          ? tenant.slug
          : undefined,
      },
    });

    for (const path of paths) {
      // IMPORTANT: tests rely on this exact log output when logging is enabled.
      if (
        logCacheInvalidation &&
        (process.env.ENV === 'local' || process.env.ENV === 'playwright')
      ) {
        console.log(`[CACHE] invalidating path: ${path}`);
      }

      if (process.env.ENV === 'prod' || process.env.ENV === 'test') {
        revalidatePath(path);
      }
    }
  } catch (error) {
    console.error(`Error invalidating cache for tenant ${tenantId}:`, error);
  }
};
