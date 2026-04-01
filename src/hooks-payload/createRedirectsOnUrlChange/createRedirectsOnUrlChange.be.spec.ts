/* eslint-disable max-nested-callbacks */

import {
  expect,
  test,
} from '@playwright/test';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  generateCollectionsExceptPages,
  generateDetailPage,
  generateHomePage,
  generateOverviewPage,
} from '@/test-helpers/collections-generator';
import {
  generateTenant,
  getTenant,
} from '@/test-helpers/tenant-generator';

const getRedirectPairs = async (tenantId: string): Promise<{
  from: string;
  to: string;
}[]> => {
  const payload = await getPayloadCached();
  const redirects = await payload.find({
    collection: 'redirects',
    depth: 0,
    limit: 0,
    pagination: false,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  });

  return redirects.docs
    .map((redirect) => ({
      from: redirect.from,
      to: redirect.to,
    }))
    .sort((a, b) => a.from.localeCompare(b.from));
};

test.describe('Create redirects on URL change', () => {
  test.beforeEach(async () => {
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test.describe('On changed page', () => {
    test('does not create redirects on page create', {
      tag: '@redirects',
    }, async () => {
      const tenant = await getTenant();
      const time = Date.now();
      const payload = await getPayloadCached();

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      await generateOverviewPage({
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: `page-create-${time}`,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([]);
    });

    test('does not create redirects on draft page update', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const draftPage = await generateDetailPage({
        draft: true,
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: `draft-page-${time}`,
      });

      await payload.update({
        collection: 'detailPage',
        data: {
          slug: `draft-page-updated-${time}`,
        },
        id: draftPage.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([]);
    });

    test('creates a redirect on page slug change', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();
      const originalSlug = `page-slug-${time}`;
      const updatedSlug = `page-slug-updated-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const page = await generateOverviewPage({
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: originalSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedSlug,
        },
        id: page.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([
          {
            from: `de/${originalSlug}`,
            to: `de/${updatedSlug}`,
          },
        ]);
    });

    test('deletes redirect when page is deleted', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();
      const originalSlug = `page-slug-${time}`;
      const updatedSlug = `page-slug-updated-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const page = await generateOverviewPage({
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: originalSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedSlug,
        },
        id: page.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([
          {
            from: `de/${originalSlug}`,
            to: `de/${updatedSlug}`,
          },
        ]);

      await payload.delete({
        collection: 'overviewPage',
        id: page.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([]);
    });

    test('creates a redirect on page slug change (non-sagw)', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const time = Date.now();
      const tenant = await generateTenant({
        name: `tenant-${time}`,
      });
      const originalSlug = `page-slug-${time}`;
      const updatedSlug = `page-slug-updated-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant.id,
      });

      const home = await generateHomePage({
        sideTitle: 'Side',
        tenant: tenant.id,
        title: 'Home',
      });

      const page = await generateOverviewPage({
        parentPage: {
          documentId: home.id,
          slug: 'homePage',
        },
        tenant: tenant.id,
        title: originalSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedSlug,
        },
        id: page.id,
      });

      await expect(getRedirectPairs(tenant.id))
        .resolves.toStrictEqual([
          {
            from: `de/tenant-${time}/${originalSlug}`,
            to: `de/tenant-${time}/${updatedSlug}`,
          },
        ]);
    });

    test('creates redirects only for the affected locale path', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();
      const originalSlug = `page-fr-${time}`;
      const updatedSlug = `page-fr-updated-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const page = await generateOverviewPage({
        locale: 'fr',
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: originalSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedSlug,
        },
        id: page.id,
        locale: 'fr',
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([
          {
            from: `fr/${originalSlug}`,
            to: `fr/${updatedSlug}`,
          },
        ]);
    });
  });

  test.describe('On child pages', () => {

    test('creates redirects for parent and child when parent slug changes', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();
      const parentSlug = `parent-page-${time}`;
      const updatedParentSlug = `parent-page-updated-${time}`;
      const childSlug = `child-page-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const parentPage = await generateOverviewPage({
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: parentSlug,
      });

      await generateDetailPage({
        parentPage: {
          documentId: parentPage.id,
          slug: 'overviewPage',
        },
        tenant: tenant || '',
        title: childSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedParentSlug,
        },
        id: parentPage.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([
          {
            from: `de/${parentSlug}`,
            to: `de/${updatedParentSlug}`,
          },
          {
            from: `de/${parentSlug}/${childSlug}`,
            to: `de/${updatedParentSlug}/${childSlug}`,
          },
        ]);
    });

    test('deletes redirects for parent and child when parent is deleted', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();
      const parentSlug = `parent-page-${time}`;
      const updatedParentSlug = `parent-page-updated-${time}`;
      const childSlug = `child-page-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const parentPage = await generateOverviewPage({
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: parentSlug,
      });

      await generateDetailPage({
        parentPage: {
          documentId: parentPage.id,
          slug: 'overviewPage',
        },
        tenant: tenant || '',
        title: childSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedParentSlug,
        },
        id: parentPage.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([
          {
            from: `de/${parentSlug}`,
            to: `de/${updatedParentSlug}`,
          },
          {
            from: `de/${parentSlug}/${childSlug}`,
            to: `de/${updatedParentSlug}/${childSlug}`,
          },
        ]);

      await payload.delete({
        collection: 'overviewPage',
        id: parentPage.id,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([]);
    });

    test('creates redirects for parent and child when parent slug changes (non-sagw)', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const time = Date.now();
      const tenantName = `redirect-tenant-${time}`;
      const originalSlug = `tenant-page-${time}`;
      const updatedSlug = `tenant-page-updated-${time}`;
      const tenant = await generateTenant({
        name: tenantName,
      });

      const home = await generateHomePage({
        sideTitle: 'Side',
        tenant: tenant.id,
        title: 'Home',
      });

      const page = await generateOverviewPage({
        navigationTitle: 'foo',
        parentPage: {
          documentId: home.id,
          slug: 'homePage',
        },
        tenant: tenant.id,
        title: originalSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: updatedSlug,
        },
        id: page.id,
      });

      await expect(getRedirectPairs(tenant.id))
        .resolves.toStrictEqual([
          {
            from: `de/${tenantName}/${originalSlug}`,
            to: `de/${tenantName}/${updatedSlug}`,
          },
        ]);
    });

    test('blocks slug change when generated redirects would create a loop', {
      tag: '@redirects',
    }, async () => {
      const payload = await getPayloadCached();
      const tenant = await getTenant();
      const time = Date.now();
      const originalSlug = `loop-page-${time}`;
      const changedSlug = `loop-page-updated-${time}`;

      await generateCollectionsExceptPages({
        tenant: tenant || '',
      });

      const home = await payload.find({
        collection: 'homePage',
        where: {
          tenant: {
            equals: tenant,
          },
        },
      });

      const page = await generateOverviewPage({
        parentPage: {
          documentId: home.docs[0].id,
          slug: 'homePage',
        },
        tenant: tenant || '',
        title: originalSlug,
      });

      await payload.update({
        collection: 'overviewPage',
        data: {
          slug: changedSlug,
        },
        id: page.id,
      });

      await expect(async () => {
        await payload.update({
          collection: 'overviewPage',
          data: {
            slug: originalSlug,
          },
          id: page.id,
        });
      }).rejects.toMatchObject({
        status: 400,
      });

      await expect(getRedirectPairs(tenant || ''))
        .resolves.toStrictEqual([
          {
            from: `de/${originalSlug}`,
            to: `de/${changedSlug}`,
          },
        ]);

      const updatedPage = await payload.findByID({
        collection: 'overviewPage',
        id: page.id,
        locale: 'de',
      });

      await expect(updatedPage.slug)
        .toBe(changedSlug);
    });
  });
});

/* eslint-enable max-nested-callbacks */
