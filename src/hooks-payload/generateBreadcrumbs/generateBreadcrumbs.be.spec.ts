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
} from '@/test-helpers/page-generator';
import { generateTenant } from '@/test-helpers/tenant-generator';

// Generate 9 levels of nested pages.
// Expect: correct data in level 9 breadcrumb.
test('Generates breadcrumb', async () => {
  let result: any;
  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  let level5: any;
  let level6: any;
  let level7: any;
  let level8: any;

  try {
    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-1`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    level5 = await generateMagazineDetailPage({
      navigationTitle: 'Level 5 Navigation Title',
      parentPage: {
        documentId: level4.id,
        slug: 'instituteDetailPage',
      },
      tenant: tenant.id,
      title: `Level 5 ${(new Date())
        .getTime()}`,
    });

    level6 = await generateNationalDictionaryDetailPage({
      navigationTitle: 'Level 6 Navigation Title',
      parentPage: {
        documentId: level5.id,
        slug: 'magazineDetailPage',
      },
      tenant: tenant.id,
      title: `Level 6 ${(new Date())
        .getTime()}`,
    });

    level7 = await generateNewsDetailPage({
      navigationTitle: 'Level 7 Navigation Title',
      parentPage: {
        documentId: level6.id,
        slug: 'nationalDictionaryDetailPage',
      },
      tenant: tenant.id,
      title: `Level 7 ${(new Date())
        .getTime()}`,
    });

    level8 = await generateProjectDetailPage({
      navigationTitle: 'Level 8 Navigation Title',
      parentPage: {
        documentId: level7.id,
        slug: 'newsDetailPage',
      },
      tenant: tenant.id,
      title: `Level 8 ${(new Date())
        .getTime()}`,
    });

    result = await generatePublicationDetailPage({
      navigationTitle: 'Level 9 Navigation Title',
      parentPage: {
        documentId: level8.id,
        slug: 'projectDetailPage',
      },
      tenant: tenant.id,
      title: `Level 9 ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  const {
    breadcrumb,
  } = result;

  await expect(breadcrumb.length)
    .toEqual(9);

  await expect(breadcrumb[0].namede)
    .toStrictEqual('Home');

  await expect(breadcrumb[1].namede)
    .toStrictEqual('Level 1 Navigation Title');

  await expect(breadcrumb[2].namede)
    .toStrictEqual('Level 2 Navigation Title');

  await expect(breadcrumb[3].namede)
    .toStrictEqual('Level 3 Navigation Title');

  await expect(breadcrumb[4].namede)
    .toStrictEqual('Level 4 Navigation Title');

  await expect(breadcrumb[5].namede)
    .toStrictEqual('Level 5 Navigation Title');

  await expect(breadcrumb[6].namede)
    .toStrictEqual('Level 6 Navigation Title');

  await expect(breadcrumb[7].namede)
    .toStrictEqual('Level 7 Navigation Title');

  await expect(breadcrumb[8].namede)
    .toStrictEqual('Level 8 Navigation Title');

  await expect(breadcrumb[0].slugde)
    .toStrictEqual('home');
  await expect(breadcrumb[1].slugde)
    .toStrictEqual(level1.slug);
  await expect(breadcrumb[2].slugde)
    .toStrictEqual(level2.slug);
  await expect(breadcrumb[3].slugde)
    .toStrictEqual(level3.slug);
  await expect(breadcrumb[4].slugde)
    .toStrictEqual(level4.slug);
  await expect(breadcrumb[5].slugde)
    .toStrictEqual(level5.slug);
  await expect(breadcrumb[6].slugde)
    .toStrictEqual(level6.slug);
  await expect(breadcrumb[7].slugde)
    .toStrictEqual(level7.slug);
  await expect(breadcrumb[8].slugde)
    .toStrictEqual(level8.slug);

});

// Generate 9 levels of nested pages.
// Expect: correct data in level 9 breadcrumb.
test('Generates breadcrumb in french', async () => {
  let result: any;
  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  let level5: any;
  let level6: any;
  let level7: any;
  let level8: any;

  try {
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

    level1 = await generateOverviewPage({
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

    level2 = await generateDetailPage({
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

    level3 = await generateEventDetailPage({
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

    level4 = await generateInstituteDetailPage({
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

    level5 = await generateMagazineDetailPage({
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

    level6 = await generateNationalDictionaryDetailPage({
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

    level7 = await generateNewsDetailPage({
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

    level8 = await generateProjectDetailPage({
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

    result = await generatePublicationDetailPage({
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

  } catch (e) {
    result = JSON.stringify(e);
  }

  const {
    breadcrumb,
  } = result;

  await expect(breadcrumb.length)
    .toEqual(9);

  await expect(breadcrumb[0].namefr)
    .toStrictEqual('Home');

  await expect(breadcrumb[1].namefr)
    .toStrictEqual('Level 1 Navigation Title');

  await expect(breadcrumb[2].namefr)
    .toStrictEqual('Level 2 Navigation Title');

  await expect(breadcrumb[3].namefr)
    .toStrictEqual('Level 3 Navigation Title');

  await expect(breadcrumb[4].namefr)
    .toStrictEqual('Level 4 Navigation Title');

  await expect(breadcrumb[5].namefr)
    .toStrictEqual('Level 5 Navigation Title');

  await expect(breadcrumb[6].namefr)
    .toStrictEqual('Level 6 Navigation Title');

  await expect(breadcrumb[7].namefr)
    .toStrictEqual('Level 7 Navigation Title');

  await expect(breadcrumb[8].namefr)
    .toStrictEqual('Level 8 Navigation Title');

  await expect(breadcrumb[0].slugfr)
    .toStrictEqual('home');
  await expect(breadcrumb[1].slugfr)
    .toStrictEqual(level1.slug);
  await expect(breadcrumb[2].slugfr)
    .toStrictEqual(level2.slug);
  await expect(breadcrumb[3].slugfr)
    .toStrictEqual(level3.slug);
  await expect(breadcrumb[4].slugfr)
    .toStrictEqual(level4.slug);
  await expect(breadcrumb[5].slugfr)
    .toStrictEqual(level5.slug);
  await expect(breadcrumb[6].slugfr)
    .toStrictEqual(level6.slug);
  await expect(breadcrumb[7].slugfr)
    .toStrictEqual(level7.slug);
  await expect(breadcrumb[8].slugfr)
    .toStrictEqual(level8.slug);

});

// Generate 3 pages. Level 1 and 2 are connected with parentPage selector.
// Home is set as parent of level 1.
// Level 3 is not connected.
// Expect: Level 2 to have 1 breadcrumb
// Expect: Level 3 to have 0 breadcrumb
test('Does not generate breadcrumb if parent page is not set', async () => {
  let result: any;
  let level2: any;

  try {
    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-2`,
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

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    result = await generatePublicationDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      tenant: tenant.id,
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(level2.breadcrumb.length)
    .toEqual(2);

  await expect(result.breadcrumb.length)
    .toEqual(0);

});

// Generate 3 pages. Level 1 and 2 are connected with parentPage selector.
// Home is not set as parent of level 1.
// Expect: Level 2 to have 1 breadcrumb
// Expect: Level 3 to have 0 breadcrumb
test('Does not generate breadcrumb if home page is not parent', async () => {
  let result: any;
  let level1: any;
  let level2: any;

  try {
    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-21`,
    });

    level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      tenant: tenant.id,
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    result = await generatePublicationDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      tenant: tenant.id,
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(level1.breadcrumb.length)
    .toEqual(0);

  await expect(level2.breadcrumb.length)
    .toEqual(0);

  await expect(result.breadcrumb.length)
    .toEqual(0);

});

// Generate 9 nested pages.
// Level 5 page has no navigation Title.
// Expect: Level 1 to 5 have breadcrumb.
// Expect: Level 6 to 9 not to have a breadcrumb.
test('Correctly sets breadcrumb if navigation Title is missing in cascade chain', async () => {
  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  let level5: any;
  let level6: any;
  let level7: any;
  let level8: any;
  let level9: any;

  try {
    const tenant = await generateTenant({
      name: `${(new Date())
        .getTime()}-tenant-3`,
    });

    const home = await generateHomePage({
      sideTitle: 'Home side title',
      tenant: tenant.id,
      title: 'Home title',
    });

    level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant: tenant.id,
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      tenant: tenant.id,
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    level5 = await generateMagazineDetailPage({
      parentPage: {
        documentId: level4.id,
        slug: 'instituteDetailPage',
      },
      tenant: tenant.id,
      title: `Level 5 ${(new Date())
        .getTime()}`,
    });

    level6 = await generateNationalDictionaryDetailPage({
      navigationTitle: 'Level 6 Navigation Title',
      parentPage: {
        documentId: level5.id,
        slug: 'magazineDetailPage',
      },
      tenant: tenant.id,
      title: `Level 6 ${(new Date())
        .getTime()}`,
    });

    level7 = await generateNewsDetailPage({
      navigationTitle: 'Level 7 Navigation Title',
      parentPage: {
        documentId: level6.id,
        slug: 'nationalDictionaryDetailPage',
      },
      tenant: tenant.id,
      title: `Level 7 ${(new Date())
        .getTime()}`,
    });

    level8 = await generateProjectDetailPage({
      navigationTitle: 'Level 8 Navigation Title',
      parentPage: {
        documentId: level7.id,
        slug: 'newsDetailPage',
      },
      tenant: tenant.id,
      title: `Level 8 ${(new Date())
        .getTime()}`,
    });

    level9 = await generatePublicationDetailPage({
      navigationTitle: 'Level 9 Navigation Title',
      parentPage: {
        documentId: level8.id,
        slug: 'projectDetailPage',
      },
      tenant: tenant.id,
      title: `Level 9 ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    level9 = JSON.stringify(e);
  }

  await expect(level1.breadcrumb.length)
    .toEqual(1);
  await expect(level2.breadcrumb.length)
    .toEqual(2);
  await expect(level3.breadcrumb.length)
    .toEqual(3);
  await expect(level4.breadcrumb.length)
    .toEqual(4);
  await expect(level5.breadcrumb.length)
    .toEqual(5);
  await expect(level6.breadcrumb.length)
    .toEqual(0);
  await expect(level7.breadcrumb.length)
    .toEqual(0);
  await expect(level8.breadcrumb.length)
    .toEqual(0);
  await expect(level9.breadcrumb.length)
    .toEqual(0);

});

// Complex example with siblings
// Generate 9 pages on 5 levels (each level has a and b).
// Each page has two children (a and b). The b page links to the next level.
// Expect: correct data in level 5b breadcrumb.
test('Generates breadcrumb with siblings', async () => {
  let level2b: any;
  let level3b: any;
  let level4b: any;
  let level5a: any;
  let level5b: any;

  try {
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

    level2b = await generateDetailPage({
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

    level3b = await generateDetailPage({
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

    level4b = await generateDetailPage({
      navigationTitle: 'Level 4b Navigation Title',
      parentPage: {
        documentId: level3b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 4b ${(new Date())
        .getTime()}`,
    });

    level5a = await generateDetailPage({
      navigationTitle: 'Level 5a Navigation Title',
      parentPage: {
        documentId: level4b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 5a ${(new Date())
        .getTime()}`,
    });

    level5b = await generateDetailPage({
      navigationTitle: 'Level 5b Navigation Title',
      parentPage: {
        documentId: level4b.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 5b ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    level5b = JSON.stringify(e);
  }

  await expect(level5b.breadcrumb[0].namede)
    .toStrictEqual('Home');

  await expect(level5b.breadcrumb[1].namede)
    .toStrictEqual('Level 2b Navigation Title');

  await expect(level5b.breadcrumb[2].namede)
    .toStrictEqual('Level 3b Navigation Title');

  await expect(level5b.breadcrumb[3].namede)
    .toStrictEqual('Level 4b Navigation Title');

  await expect(level5a.breadcrumb[0].namede)
    .toStrictEqual('Home');

  await expect(level5a.breadcrumb[1].namede)
    .toStrictEqual('Level 2b Navigation Title');

  await expect(level5a.breadcrumb[2].namede)
    .toStrictEqual('Level 3b Navigation Title');

  await expect(level5a.breadcrumb[3].namede)
    .toStrictEqual('Level 4b Navigation Title');

});
