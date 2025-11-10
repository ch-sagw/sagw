import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateEventDetailPage,
  generateInstituteDetailPage,
  generateMagazineDetailPage,
  generateNationalDictionaryDetailPage,
  generateNewsDetailPage,
  generateOverviewPage,
  generateProjectDetailPage,
  generatePublicationDetailPage,
} from '@/test-helpers/page-generator';

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
    level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    level5 = await generateMagazineDetailPage({
      navigationTitle: 'Level 5 Navigation Title',
      parentPage: {
        documentId: level4.id,
        slug: 'instituteDetailPage',
      },
      title: `Level 5 ${(new Date())
        .getTime()}`,
    });

    level6 = await generateNationalDictionaryDetailPage({
      navigationTitle: 'Level 6 Navigation Title',
      parentPage: {
        documentId: level5.id,
        slug: 'magazineDetailPage',
      },
      title: `Level 6 ${(new Date())
        .getTime()}`,
    });

    level7 = await generateNewsDetailPage({
      navigationTitle: 'Level 7 Navigation Title',
      parentPage: {
        documentId: level6.id,
        slug: 'nationalDictionaryDetailPage',
      },
      title: `Level 7 ${(new Date())
        .getTime()}`,
    });

    level8 = await generateProjectDetailPage({
      navigationTitle: 'Level 8 Navigation Title',
      parentPage: {
        documentId: level7.id,
        slug: 'newsDetailPage',
      },
      title: `Level 8 ${(new Date())
        .getTime()}`,
    });

    result = await generatePublicationDetailPage({
      navigationTitle: 'Level 9 Navigation Title',
      parentPage: {
        documentId: level8.id,
        slug: 'projectDetailPage',
      },
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
    .toEqual(8);

  await expect(breadcrumb[0].namede)
    .toStrictEqual('Level 1 Navigation Title');

  await expect(breadcrumb[1].namede)
    .toStrictEqual('Level 2 Navigation Title');

  await expect(breadcrumb[2].namede)
    .toStrictEqual('Level 3 Navigation Title');

  await expect(breadcrumb[3].namede)
    .toStrictEqual('Level 4 Navigation Title');

  await expect(breadcrumb[4].namede)
    .toStrictEqual('Level 5 Navigation Title');

  await expect(breadcrumb[5].namede)
    .toStrictEqual('Level 6 Navigation Title');

  await expect(breadcrumb[6].namede)
    .toStrictEqual('Level 7 Navigation Title');

  await expect(breadcrumb[7].namede)
    .toStrictEqual('Level 8 Navigation Title');

  await expect(breadcrumb[0].slugde)
    .toStrictEqual(level1.slug);
  await expect(breadcrumb[1].slugde)
    .toStrictEqual(level2.slug);
  await expect(breadcrumb[2].slugde)
    .toStrictEqual(level3.slug);
  await expect(breadcrumb[3].slugde)
    .toStrictEqual(level4.slug);
  await expect(breadcrumb[4].slugde)
    .toStrictEqual(level5.slug);
  await expect(breadcrumb[5].slugde)
    .toStrictEqual(level6.slug);
  await expect(breadcrumb[6].slugde)
    .toStrictEqual(level7.slug);
  await expect(breadcrumb[7].slugde)
    .toStrictEqual(level8.slug);

});

// Generate 3 pages. Level 1 and 2 are connected with parentPage selector.
// Level 3 is not connected.
// Expect: Level 2 to have 1 breadcrumb
// Expect: Level 3 to have 0 breadcrumb
test('Does not generate breadcrumb if parent page is not set', async () => {
  let result: any;
  let level2: any;

  try {
    const level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    result = await generatePublicationDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(level2.breadcrumb.length)
    .toEqual(1);

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
    level1 = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    level4 = await generateInstituteDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: level3.id,
        slug: 'eventDetailPage',
      },
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    level5 = await generateMagazineDetailPage({
      parentPage: {
        documentId: level4.id,
        slug: 'instituteDetailPage',
      },
      title: `Level 5 ${(new Date())
        .getTime()}`,
    });

    level6 = await generateNationalDictionaryDetailPage({
      navigationTitle: 'Level 6 Navigation Title',
      parentPage: {
        documentId: level5.id,
        slug: 'magazineDetailPage',
      },
      title: `Level 6 ${(new Date())
        .getTime()}`,
    });

    level7 = await generateNewsDetailPage({
      navigationTitle: 'Level 7 Navigation Title',
      parentPage: {
        documentId: level6.id,
        slug: 'nationalDictionaryDetailPage',
      },
      title: `Level 7 ${(new Date())
        .getTime()}`,
    });

    level8 = await generateProjectDetailPage({
      navigationTitle: 'Level 8 Navigation Title',
      parentPage: {
        documentId: level7.id,
        slug: 'newsDetailPage',
      },
      title: `Level 8 ${(new Date())
        .getTime()}`,
    });

    level9 = await generatePublicationDetailPage({
      navigationTitle: 'Level 9 Navigation Title',
      parentPage: {
        documentId: level8.id,
        slug: 'projectDetailPage',
      },
      title: `Level 9 ${(new Date())
        .getTime()}`,
    });

  } catch (e) {
    level9 = JSON.stringify(e);
  }

  await expect(level2.breadcrumb.length)
    .toEqual(1);
  await expect(level3.breadcrumb.length)
    .toEqual(2);
  await expect(level4.breadcrumb.length)
    .toEqual(3);
  await expect(level5.breadcrumb.length)
    .toEqual(4);
  await expect(level6.breadcrumb.length)
    .toEqual(0);
  await expect(level7.breadcrumb.length)
    .toEqual(0);
  await expect(level8.breadcrumb.length)
    .toEqual(0);
  await expect(level9.breadcrumb.length)
    .toEqual(0);

});
