/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateHomePage,
  generateInstituteDetailPage,
  generateOverviewPage,
} from '@/test-helpers/collections-generator';
import { generateTenant } from '@/test-helpers/tenant-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { seoData } from '@/seed/test-data/seoData';
import { buildBreadcrumbsForDoc } from '@/utilities/buildBreadcrumbs';

// Breadcrumbs are no longer stored / cascaded; these tests verify the
// on-the-fly utility returns fresh values for descendants when ancestor
// metadata (navigationTitle, slug, parentPage, status) changes.

test.describe('breadcrumb-on-the-fly', () => {
  test.beforeEach(async () => {
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('Reflects navigationTitle change on ancestors', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        navigationTitle: 'New Level 2 Navigation Title',
      },
      id: level2.id,
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc![2].name.de)
      .toStrictEqual('New Level 2 Navigation Title');
    expect(level4Bc![2].name.de)
      .toStrictEqual('New Level 2 Navigation Title');
  });

  test('Reflects navigationTitle change on ancestors in french', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-11`,
    });

    const home = await generateHomePage({
      locale: 'fr',
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      locale: 'fr',
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        navigationTitle: 'New Level 2 Navigation Title',
      },
      id: level2.id,
      locale: 'fr',
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc![2].name.fr)
      .toStrictEqual('New Level 2 Navigation Title');
    expect(level4Bc![2].name.fr)
      .toStrictEqual('New Level 2 Navigation Title');
  });

  test('Reflects slug change on ancestors', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();
    const newSlug = `new-slug-level2-${time}`;

    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        slug: newSlug,
      },
      id: level2.id,
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc![2].slug.de)
      .toStrictEqual(newSlug);
    expect(level4Bc![2].slug.de)
      .toStrictEqual(newSlug);
  });

  test('Reflects slug change on ancestors in french', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();
    const newSlug = `new-slug-level2-${time}`;

    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
    });

    const home = await generateHomePage({
      locale: 'fr',
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      locale: 'fr',
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        slug: newSlug,
      },
      id: level2.id,
      locale: 'fr',
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc![2].slug.fr)
      .toStrictEqual(newSlug);
    expect(level4Bc![2].slug.fr)
      .toStrictEqual(newSlug);
  });

  test('Reflects slug added in other locale', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'overviewPage',
      data: {
        hero: {
          title: simpleRteConfig(`Level 1 fr ${time}`),
        },
        ...seoData,
        navigationTitle: `Level 1 Navigation Title fr ${time}`,
      },
      id: level1.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(`Level 2 fr ${time}`),
        },
        navigationTitle: `Level 2 Navigation Title fr ${time}`,
        ...seoData,
      },
      id: level2.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'eventDetailPage',
      data: {
        eventDetails: {
          title: simpleRteConfig(`Level 3 fr ${time}`),
        },
        navigationTitle: `Level 3 Navigation Title fr ${time}`,
        ...seoData,
      },
      id: level3.id,
      locale: 'fr',
    });

    await payload.update({
      collection: 'instituteDetailPage',
      data: {
        hero: {
          title: simpleRteConfig(`Level 4 fr ${time}`),
        },
        navigationTitle: `Level 4 Navigation Title fr ${time}`,
        overviewPageProps: level4.overviewPageProps,
        ...seoData,
      },
      id: level4.id,
      locale: 'fr',
    });

    // Re-fetch level3/level4 docs with all locales so parentPage is current.
    const level3Fresh = await payload.findByID({
      collection: 'eventDetailPage',
      id: level3.id,
      locale: 'all',
    });
    const level4Fresh = await payload.findByID({
      collection: 'instituteDetailPage',
      id: level4.id,
      locale: 'all',
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3Fresh as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4Fresh as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc![2].slug.fr)
      .toStrictEqual(`level-2-fr-${time}`);
    expect(level4Bc![2].slug.fr)
      .toStrictEqual(`level-2-fr-${time}`);
    expect(level4Bc![3].slug.fr)
      .toStrictEqual(`level-3-fr-${time}`);
  });

  test('Reflects parentPage re-linking', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-4`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'eventDetailPage',
      data: {
        parentPage: {
          documentId: level1.id,
          slug: 'overviewPage',
        },
      },
      id: level3.id,
    });

    // Re-fetch with the new parentPage.
    const level3Fresh = await payload.findByID({
      collection: 'eventDetailPage',
      id: level3.id,
      locale: 'all',
    });
    const level4Fresh = await payload.findByID({
      collection: 'instituteDetailPage',
      id: level4.id,
      locale: 'all',
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3Fresh as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4Fresh as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc!.length)
      .toBe(2);
    expect(level4Bc!.length)
      .toBe(3);

    expect(level3Bc![0].name.de)
      .toStrictEqual('Home');
    expect(level3Bc![1].name.de)
      .toStrictEqual('Level 1 Navigation Title');

    expect(level4Bc![0].name.de)
      .toStrictEqual('Home');
    expect(level4Bc![1].name.de)
      .toStrictEqual('Level 1 Navigation Title');
    expect(level4Bc![2].name.de)
      .toStrictEqual('Level 3 Navigation Title');
  });

  test('Produces empty breadcrumb when an ancestor is deleted', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-5`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.delete({
      collection: 'detailPage',
      id: level2.id,
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc!.length)
      .toBe(0);
    expect(level4Bc!.length)
      .toBe(0);
  });

  test('Produces empty breadcrumb when an ancestor is unpublished', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-6`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        _status: 'draft',
      },
      id: level2.id,
    });

    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level3Bc!.length)
      .toBe(0);
    expect(level4Bc!.length)
      .toBe(0);
  });

  test('Produces empty breadcrumb when home is unpublished', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-7`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${time}`,
    });

    await payload.update({
      collection: 'homePage',
      data: {
        _status: 'draft',
      },
      id: home.id,
    });

    const level1Bc = await buildBreadcrumbsForDoc({
      doc: level1 as unknown as Record<string, unknown>,
      payload,
    });
    const level2Bc = await buildBreadcrumbsForDoc({
      doc: level2 as unknown as Record<string, unknown>,
      payload,
    });
    const level3Bc = await buildBreadcrumbsForDoc({
      doc: level3 as unknown as Record<string, unknown>,
      payload,
    });
    const level4Bc = await buildBreadcrumbsForDoc({
      doc: level4 as unknown as Record<string, unknown>,
      payload,
    });

    expect(level1Bc!.length)
      .toBe(0);
    expect(level2Bc!.length)
      .toBe(0);
    expect(level3Bc!.length)
      .toBe(0);
    expect(level4Bc!.length)
      .toBe(0);
  });

  // Discovered during manual test: created overview (home as parent), created
  // detail (overview as parent). then added an rte block with plain text to
  // home. This lead to the parentPage being emptied on overview page.
  // Guards against regressions of parent preservation.
  test('Unrelated content edits do not clobber parentPage on descendants', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });
    const time = new Date()
      .getTime();

    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${time}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    await payload.update({
      collection: 'homePage',
      data: {
        content: [
          {
            blockType: 'textBlock',
            text: simpleRteConfig('foo'),
          },
        ],
      },
      id: home.id,
    });

    const level1Updated = await payload.findByID({
      collection: 'overviewPage',
      id: level1.id,
    });

    const level2Updated = await payload.findByID({
      collection: 'detailPage',
      id: level2.id,
    });

    expect(level1Updated.parentPage?.slug)
      .toStrictEqual('homePage');
    expect(level1Updated.parentPage?.documentId)
      .toStrictEqual(home.id);
    expect(level2Updated.parentPage?.slug)
      .toStrictEqual('overviewPage');
    expect(level2Updated.parentPage?.documentId)
      .toStrictEqual(level1.id);
  });
});
