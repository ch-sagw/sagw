import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { test } from '@playwright/test';
import { generateCollectionsExceptPages } from './collections-generator';
import {
  getTenant, getTenantNonSagw,
} from './tenant-generator';

export const beforeEachPrepareData = (): void => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();

    // add generic data
    const tenant = await getTenant();
    const tenantNonSagw = await getTenantNonSagw();

    await generateCollectionsExceptPages({
      tenant: tenant || '',
    });

    await generateCollectionsExceptPages({
      tenant: tenantNonSagw || '',
    });
  });
};
