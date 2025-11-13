import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage, generateOverviewPage,
} from '@/test-helpers/page-generator';

test('Detects direct circular reference', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let result: any;

  try {
    const overviewPage = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    const detailPage1 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    result = await payload.update({
      collection: 'overviewPage',
      data: {
        parentPage: {
          documentId: detailPage1.id,
          slug: 'detailPage',
        },
      },
      id: overviewPage.id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(JSON.parse(result).data.errors[0].message)
    .toStrictEqual('Cannot set parent page because it would create a circular reference. This page or one of its ancestors is already a descendant of the current page.');

});

test('Detects deep circular reference', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let result: any;

  try {
    const overviewPage = await generateOverviewPage({
      navigationTitle: 'Level 1 Navigation Title',
      title: `Level 1 ${(new Date())
        .getTime()}`,
    });

    const detailPage1 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: overviewPage.id,
        slug: 'overviewPage',
      },
      title: `Level 2 ${(new Date())
        .getTime()}`,
    });

    const detailPage2 = await generateDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: detailPage1.id,
        slug: 'detailPage',
      },
      title: `Level 3 ${(new Date())
        .getTime()}`,
    });

    const detailPage3 = await generateDetailPage({
      navigationTitle: 'Level 4 Navigation Title',
      parentPage: {
        documentId: detailPage2.id,
        slug: 'detailPage',
      },
      title: `Level 4 ${(new Date())
        .getTime()}`,
    });

    result = await payload.update({
      collection: 'overviewPage',
      data: {
        parentPage: {
          documentId: detailPage3.id,
          slug: 'detailPage',
        },
      },
      id: overviewPage.id,
    });

  } catch (e) {
    result = JSON.stringify(e);
  }

  await expect(JSON.parse(result).data.errors[0].message)
    .toStrictEqual('Cannot set parent page because it would create a circular reference. This page or one of its ancestors is already a descendant of the current page.');

});

