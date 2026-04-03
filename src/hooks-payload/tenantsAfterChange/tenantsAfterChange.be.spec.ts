import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { generateTenant } from '@/test-helpers/tenant-generator';

test.describe('After creating tenant', () => {
  test('adds default tenant data', async () => {
    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayload({
      config: configPromise,
    });
    const time = (new Date())
      .getTime();
    const tenant = await generateTenant({
      name: `tenant-${time}`,
    });

    const consent = await payload.find({
      collection: 'consent',
      where: {
        tenant: {
          equals: tenant.id,
        },
      },
    });

    const contentSnippets = await payload.find({
      collection: 'i18nGlobals',
      where: {
        tenant: {
          equals: tenant.id,
        },
      },
    });

    const errorPage = await payload.find({
      collection: 'errorPage',
      where: {
        tenant: {
          equals: tenant.id,
        },
      },
    });

    const forms = await payload.find({
      collection: 'forms',
      where: {
        tenant: {
          equals: tenant.id,
        },
      },
    });

    const status = await payload.find({
      collection: 'statusMessage',
      where: {
        tenant: {
          equals: tenant.id,
        },
      },
    });

    await expect(consent.docs.length)
      .toEqual(1);
    await expect(contentSnippets.docs.length)
      .toEqual(1);
    await expect(errorPage.docs.length)
      .toEqual(1);
    await expect(forms.docs.length)
      .toEqual(1);
    await expect(status.docs.length)
      .toEqual(1);
  });

});
