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

test.describe('Before deleting tenant', () => {
  test('deletes all tenant related collections', async () => {
    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayload({
      config: configPromise,
    });
    const time = (new Date())
      .getTime();
    const tenant = await generateTenant({
      addDefaultTenantData: true,
      slug: `tenant-${time}`,
    });

    await payload.delete({
      collection: 'tenants',
      id: tenant.id,
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
      .toEqual(0);
    await expect(contentSnippets.docs.length)
      .toEqual(0);
    await expect(errorPage.docs.length)
      .toEqual(0);
    await expect(forms.docs.length)
      .toEqual(0);
    await expect(status.docs.length)
      .toEqual(0);
  });

  test('deletes only tenant related collections of deleted tenant', async () => {
    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayload({
      config: configPromise,
    });
    const time = (new Date())
      .getTime();
    const tenant = await generateTenant({
      addDefaultTenantData: true,
      slug: `tenant-${time}`,
    });
    const tenant2 = await generateTenant({
      addDefaultTenantData: true,
      slug: `tenant2-${time}`,
    });
    const tenant3 = await generateTenant({
      addDefaultTenantData: true,
      slug: `tenant3-${time}`,
    });

    await payload.delete({
      collection: 'tenants',
      id: tenant.id,
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

    const consent2 = await payload.find({
      collection: 'consent',
      where: {
        tenant: {
          equals: tenant2.id,
        },
      },
    });

    const contentSnippets2 = await payload.find({
      collection: 'i18nGlobals',
      where: {
        tenant: {
          equals: tenant2.id,
        },
      },
    });

    const errorPage2 = await payload.find({
      collection: 'errorPage',
      where: {
        tenant: {
          equals: tenant2.id,
        },
      },
    });

    const forms2 = await payload.find({
      collection: 'forms',
      where: {
        tenant: {
          equals: tenant2.id,
        },
      },
    });

    const status2 = await payload.find({
      collection: 'statusMessage',
      where: {
        tenant: {
          equals: tenant2.id,
        },
      },
    });

    const consent3 = await payload.find({
      collection: 'consent',
      where: {
        tenant: {
          equals: tenant3.id,
        },
      },
    });

    const contentSnippets3 = await payload.find({
      collection: 'i18nGlobals',
      where: {
        tenant: {
          equals: tenant3.id,
        },
      },
    });

    const errorPage3 = await payload.find({
      collection: 'errorPage',
      where: {
        tenant: {
          equals: tenant3.id,
        },
      },
    });

    const forms3 = await payload.find({
      collection: 'forms',
      where: {
        tenant: {
          equals: tenant3.id,
        },
      },
    });

    const status3 = await payload.find({
      collection: 'statusMessage',
      where: {
        tenant: {
          equals: tenant3.id,
        },
      },
    });

    await expect(consent.docs.length)
      .toEqual(0);
    await expect(contentSnippets.docs.length)
      .toEqual(0);
    await expect(errorPage.docs.length)
      .toEqual(0);
    await expect(forms.docs.length)
      .toEqual(0);
    await expect(status.docs.length)
      .toEqual(0);

    await expect(consent2.docs.length)
      .toEqual(1);
    await expect(contentSnippets2.docs.length)
      .toEqual(1);
    await expect(errorPage2.docs.length)
      .toEqual(1);
    await expect(forms2.docs.length)
      .toEqual(1);
    await expect(status2.docs.length)
      .toEqual(1);

    await expect(consent3.docs.length)
      .toEqual(1);
    await expect(contentSnippets3.docs.length)
      .toEqual(1);
    await expect(errorPage3.docs.length)
      .toEqual(1);
    await expect(forms3.docs.length)
      .toEqual(1);
    await expect(status3.docs.length)
      .toEqual(1);
  });

});
