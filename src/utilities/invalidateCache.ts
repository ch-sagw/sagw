import type { BasePayload } from 'payload';
import { getTenantRoutePaths } from '@/app/(frontend)/utilities/getTenantRouteParams';
import { revalidatePath } from 'next/cache.js';

export const invalidateCache = async ({
  payload,
  tenantId,
}: {
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
      payload,
      tenant: {
        id: tenant.id,
        languages: tenant.languages,
        name: tenant.name as string | Record<string, string> | undefined,
        slug: tenant.slug as string | Record<string, string> | undefined,
      },
    });

    for (const path of paths) {
      // IMPORTANT: do not change this log. This is neccessary for testing!!
      console.log(`[CACHE] invalidating path: ${path}`);

      if (process.env.ENV === 'prod' || process.env.ENV === 'test') {
        revalidatePath(path);
      }
    }
  } catch (error) {
    console.error(`Error invalidating cache for tenant ${tenantId}:`, error);
  }
};
