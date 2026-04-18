/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */

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
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
} from '@/test-helpers/collections-generator';
import { generateTenant } from '@/test-helpers/tenant-generator';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { buildBreadcrumbsForDoc } from '@/utilities/buildBreadcrumbs';
import { simpleRteConfig } from './simpleRteConfig';
import { seoData } from '@/seed/test-data/seoData';

// Breadcrumbs are no longer persisted on documents. These tests exercise
// the shared buildBreadcrumbs utility against live data - the same path
// used at render, URL build, sitemap, and admin preview time.

test.describe('breadcrumb-generation (on the fly)', () => {
  test.beforeEach(async () => {
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('Generates breadcrumb', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });

    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-1`,
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
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    const level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    const level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    const level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    const level5 = await generateMagazineDetailPage({
      navigationTitle: 'Level 5 Navigation Title',
      parentPage: {
        documentId: level4.id,
        slug: 'instituteDetailPage',
      },
      tenant: tenant.id,
      title: `Level 5 ${(new Date())
        .getTime()}`,
    });

    const level6 = await generateNationalDictionaryDetailPage({
      navigationTitle: 'Level 6 Navigation Title',
      parentPage: {
        documentId: level5.id,
        slug: 'magazineDetailPage',
      },
      tenant: tenant.id,
      title: `Level 6 ${(new Date())
        .getTime()}`,
    });

    const level7 = await generateNewsDetailPage({
      navigationTitle: 'Level 7 Navigation Title',
      parentPage: {
        documentId: level6.id,
        slug: 'nationalDictionaryDetailPage',
      },
      tenant: tenant.id,
      title: `Level 7 ${(new Date())
        .getTime()}`,
    });

    const level8 = await generateProjectDetailPage({
      navigationTitle: 'Level 8 Navigation Title',
      parentPage: {
        documentId: level7.id,
        slug: 'newsDetailPage',
      },
      tenant: tenant.id,
      title: `Level 8 ${(new Date())
        .getTime()}`,
    });

    const level9 = await generatePublicationDetailPage({
      navigationTitle: 'Level 9 Navigation Title',
      parentPage: {
        documentId: level8.id,
        slug: 'projectDetailPage',
      },
      tenant: tenant.id,
      title: `Level 9 ${(new Date())
        .getTime()}`,
    });

    const breadcrumb = await buildBreadcrumbsForDoc({
      doc: level9 as unknown as Record<string, unknown>,
      payload,
    });

    expect(breadcrumb?.length)
      .toEqual(9);

    expect(breadcrumb![0].name.de)
      .toStrictEqual('Home');
    expect(breadcrumb![1].name.de)
      .toStrictEqual('Level 1 Navigation Title');
    expect(breadcrumb![2].name.de)
      .toStrictEqual('Level 2 Navigation Title');
    expect(breadcrumb![3].name.de)
      .toStrictEqual('Level 3 Navigation Title');
    expect(breadcrumb![4].name.de)
      .toStrictEqual('Level 4 Navigation Title');
    expect(breadcrumb![5].name.de)
      .toStrictEqual('Level 5 Navigation Title');
    expect(breadcrumb![6].name.de)
      .toStrictEqual('Level 6 Navigation Title');
    expect(breadcrumb![7].name.de)
      .toStrictEqual('Level 7 Navigation Title');
    expect(breadcrumb![8].name.de)
      .toStrictEqual('Level 8 Navigation Title');

    expect(breadcrumb![0].slug.de)
      .toStrictEqual('home');
    expect(breadcrumb![1].slug.de)
      .toStrictEqual(level1.slug);
    expect(breadcrumb![2].slug.de)
      .toStrictEqual(level2.slug);
    expect(breadcrumb![3].slug.de)
      .toStrictEqual(level3.slug);
    expect(breadcrumb![4].slug.de)
      .toStrictEqual(level4.slug);
    expect(breadcrumb![5].slug.de)
      .toStrictEqual(level5.slug);
    expect(breadcrumb![6].slug.de)
      .toStrictEqual(level6.slug);
    expect(breadcrumb![7].slug.de)
      .toStrictEqual(level7.slug);
    expect(breadcrumb![8].slug.de)
      .toStrictEqual(level8.slug);
  });

  test('Generates breadcrumb in french', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });

    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-11`,
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
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    const level2 = await generateDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    const level3 = await generateEventDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    const level4 = await generateInstituteDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    const level5 = await generateMagazineDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 5 Navigation Title',
      parentPage: {
        documentId: level4.id,
        slug: 'instituteDetailPage',
      },
      tenant: tenant.id,
      title: `Level 5 ${(new Date())
        .getTime()}`,
    });

    const level6 = await generateNationalDictionaryDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 6 Navigation Title',
      parentPage: {
        documentId: level5.id,
        slug: 'magazineDetailPage',
      },
      tenant: tenant.id,
      title: `Level 6 ${(new Date())
        .getTime()}`,
    });

    const level7 = await generateNewsDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 7 Navigation Title',
      parentPage: {
        documentId: level6.id,
        slug: 'nationalDictionaryDetailPage',
      },
      tenant: tenant.id,
      title: `Level 7 ${(new Date())
        .getTime()}`,
    });

    const level8 = await generateProjectDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 8 Navigation Title',
      parentPage: {
        documentId: level7.id,
        slug: 'newsDetailPage',
      },
      tenant: tenant.id,
      title: `Level 8 ${(new Date())
        .getTime()}`,
    });

    const level9 = await generatePublicationDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 9 Navigation Title',
      parentPage: {
        documentId: level8.id,
        slug: 'projectDetailPage',
      },
      tenant: tenant.id,
      title: `Level 9 ${(new Date())
        .getTime()}`,
    });

    const breadcrumb = await buildBreadcrumbsForDoc({
      doc: level9 as unknown as Record<string, unknown>,
      payload,
    });

    expect(breadcrumb?.length)
      .toEqual(9);

    expect(breadcrumb![0].name.fr)
      .toStrictEqual('Page d\'accueil');
    expect(breadcrumb![1].name.fr)
      .toStrictEqual('Level 1 Navigation Title');
    expect(breadcrumb![2].name.fr)
      .toStrictEqual('Level 2 Navigation Title');
    expect(breadcrumb![3].name.fr)
      .toStrictEqual('Level 3 Navigation Title');
    expect(breadcrumb![4].name.fr)
      .toStrictEqual('Level 4 Navigation Title');
    expect(breadcrumb![5].name.fr)
      .toStrictEqual('Level 5 Navigation Title');
    expect(breadcrumb![6].name.fr)
      .toStrictEqual('Level 6 Navigation Title');
    expect(breadcrumb![7].name.fr)
      .toStrictEqual('Level 7 Navigation Title');
    expect(breadcrumb![8].name.fr)
      .toStrictEqual('Level 8 Navigation Title');

    expect(breadcrumb![0].slug.fr)
      .toStrictEqual('home');
    expect(breadcrumb![1].slug.fr)
      .toStrictEqual(level1.slug);
    expect(breadcrumb![2].slug.fr)
      .toStrictEqual(level2.slug);
    expect(breadcrumb![3].slug.fr)
      .toStrictEqual(level3.slug);
    expect(breadcrumb![4].slug.fr)
      .toStrictEqual(level4.slug);
    expect(breadcrumb![5].slug.fr)
      .toStrictEqual(level5.slug);
    expect(breadcrumb![6].slug.fr)
      .toStrictEqual(level6.slug);
    expect(breadcrumb![7].slug.fr)
      .toStrictEqual(level7.slug);
    expect(breadcrumb![8].slug.fr)
      .toStrictEqual(level8.slug);
  });

  // Siblings: ensure that parent chain traversal picks the correct
  // ancestor for each descendant.
  test('Generates breadcrumb with siblings', {
    tag: '@breadcrumb',
  }, async () => {
    const payload = await getPayload({
      config: configPromise,
    });

    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-3`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    await generateDetailPage({
      navigationTitle: 'Level 2a Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 2a ${(new Date())
        .getTime()}`,
    });

    const level2b = await generateDetailPage({
      navigationTitle: 'Level 2b Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 2b ${(new Date())
        .getTime()}`,
    });

    await generateDetailPage({
      navigationTitle: 'Level 3a Navigation Title',
      parentPage: {
        documentId: level2b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3a ${(new Date())
        .getTime()}`,
    });

    const level3b = await generateDetailPage({
      navigationTitle: 'Level 3b Navigation Title',
      parentPage: {
        documentId: level2b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3b ${(new Date())
        .getTime()}`,
    });

    await generateDetailPage({
      navigationTitle: 'Level 4a Navigation Title',
      parentPage: {
        documentId: level3b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 4a ${(new Date())
        .getTime()}`,
    });

    const level4b = await generateDetailPage({
      navigationTitle: 'Level 4b Navigation Title',
      parentPage: {
        documentId: level3b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 4b ${(new Date())
        .getTime()}`,
    });

    const level5a = await generateDetailPage({
      navigationTitle: 'Level 5a Navigation Title',
      parentPage: {
        documentId: level4b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 5a ${(new Date())
        .getTime()}`,
    });

    const level5b = await generateDetailPage({
      navigationTitle: 'Level 5b Navigation Title',
      parentPage: {
        documentId: level4b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 5b ${(new Date())
        .getTime()}`,
    });

    const bc5b = await buildBreadcrumbsForDoc({
      doc: level5b as unknown as Record<string, unknown>,
      payload,
    });
    const bc5a = await buildBreadcrumbsForDoc({
      doc: level5a as unknown as Record<string, unknown>,
      payload,
    });

    expect(bc5b![0].name.de)
      .toStrictEqual('Home');
    expect(bc5b![1].name.de)
      .toStrictEqual('Level 2b Navigation Title');
    expect(bc5b![2].name.de)
      .toStrictEqual('Level 3b Navigation Title');
    expect(bc5b![3].name.de)
      .toStrictEqual('Level 4b Navigation Title');

    expect(bc5a![0].name.de)
      .toStrictEqual('Home');
    expect(bc5a![1].name.de)
      .toStrictEqual('Level 2b Navigation Title');
    expect(bc5a![2].name.de)
      .toStrictEqual('Level 3b Navigation Title');
    expect(bc5a![3].name.de)
      .toStrictEqual('Level 4b Navigation Title');
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
});
