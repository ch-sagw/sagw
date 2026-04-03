import { tenantInitialData } from '@/seed/tenantInitialData';
import type { CollectionAfterChangeHook } from 'payload';

// skip intial data if we create empty tenants on dev
export const skipTenantInitialDataContext = {
  skipTenantInitialData: true,
} as const;

export const hookTenantsAfterCreate: CollectionAfterChangeHook = async ({
  context,
  doc,
  operation,
}): Promise<void> => {
  if (context.skipTenantInitialData) {
    return;
  }

  if (operation !== 'create') {
    return;
  }

  await tenantInitialData({
    tenantId: doc.id,
  });
};
