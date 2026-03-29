import {
  expect,
  test,
} from '@playwright/test';
import { extendExpect } from '@/access/test/extendExpect';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenant } from '@/test-helpers/tenant-generator';

extendExpect(expect);

test.describe('Validate Redirects from/to format', () => {
  test.beforeEach(async () => {
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('disallows leading slashes', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: '/de/foo',
          tenant: tenant || '',
          to: 'de/bar',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/foo',
          tenant: tenant || '',
          to: '/de/bar',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('requires locale code and slash at start', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'defoo',
          tenant: tenant || '',
          to: 'de/bar',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'foo/bar',
          tenant: tenant || '',
          to: 'de/bar',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/bar',
          tenant: tenant || '',
          to: 'defoo',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/bar',
          tenant: tenant || '',
          to: 'foo/bar',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('allows correct format', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/foo',
          tenant: tenant || '',
          to: 'de/bar',
        },
      });
    })
      .notRejects();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'fr/foo',
          tenant: tenant || '',
          to: 'fr/bar',
        },
      });
    })
      .notRejects();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'it/foo',
          tenant: tenant || '',
          to: 'it/bar',
        },
      });
    })
      .notRejects();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'en/foo',
          tenant: tenant || '',
          to: 'en/bar',
        },
      });
    })
      .notRejects();

  });
});
