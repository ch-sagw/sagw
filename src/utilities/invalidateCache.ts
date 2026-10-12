import type { BasePayload } from 'payload';
import { getTenantRoutePaths } from '@/utilities/getTenantRouteParams';
import { revalidatePath } from 'next/cache.js';

// Enumerates all frontend paths of a tenant from the current database state.
//
// Used by `invalidateCache` and by the "capture before" hooks: a path that
// disappears with a mutation (page deleted, slug renamed, language variant
// removed) is no longer enumerable afterwards, so it has to be collected
// before the mutation and passed to `invalidateCache` as `additionalPaths`.
export const getTenantRoutePathsByTenantId = async ({
  includeDrafts,
  payload,
  tenantId,
}: {
  includeDrafts?: boolean;
  payload: BasePayload;
  tenantId?: string | null;
}): Promise<string[]> => {
  if (!payload || !tenantId) {
    return [];
  }

  try {
    const tenant = await payload.findByID({
      collection: 'tenants',
      depth: 0,
      id: tenantId,
      locale: 'all',
      overrideAccess: true,
    });

    return await getTenantRoutePaths({
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
  } catch (error) {
    console.error(`Error collecting route paths for tenant ${tenantId}:`, error);

    return [];
  }
};

export const invalidateCache = async ({
  additionalPaths = [],
  includeDrafts,
  logCacheInvalidation = false,
  payload,
  tenantId,
}: {
  additionalPaths?: string[];
  includeDrafts?: boolean;
  logCacheInvalidation?: boolean;
  payload: BasePayload;
  tenantId?: string | null;
}): Promise<void> => {
  if (!payload || !tenantId) {
    return;
  }

  try {
    const currentPaths = await getTenantRoutePathsByTenantId({
      includeDrafts,
      payload,
      tenantId,
    });

    const paths = [
      ...new Set([
        ...currentPaths,
        ...additionalPaths,
      ]),
    ];

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
