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
  generateInstituteDetailPage,
  generateOverviewPage,
} from '@/test-helpers/page-generator';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

// 1. Generate 4 levels of nested pages.
// 2. Change navigation title on level 2.
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates on navigationTitle change', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;

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

    await payload.update({
      collection: 'detailPage',
      data: {
        navigationTitle: 'New Level 2 Navigation Title',
      },
      id: level2.id,
    });

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
  });

  await expect(level3Updated!.breadcrumb![1].namede)
    .toStrictEqual('New Level 2 Navigation Title');

  await expect(level4Updated!.breadcrumb![1].namede)
    .toStrictEqual('New Level 2 Navigation Title');

});

// 1. Generate 4 levels of nested pages.
// 2. Change hero title on level 2 (thus the slug also changes).
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates on slug change', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const newTitle = `New Title Level 2 ${(new Date())
    .getTime()}`;

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

    await payload.update({
      collection: 'detailPage',
      data: {
        hero: {
          title: simpleRteConfig(newTitle),
        },
      },
      id: level2.id,
    });

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
  });

  const expectNewTitle = newTitle.toLowerCase()
    .replaceAll(' ', '-');

  await expect(level3Updated!.breadcrumb![1].slugde)
    .toStrictEqual(expectNewTitle);

  await expect(level4Updated!.breadcrumb![1].slugde)
    .toStrictEqual(expectNewTitle);

});

// 1. Generate 4 levels of nested pages.
// 2. Remove parentPage on level 2
// Expect: 1 breadcrumb on level 3 and 2 breadcrumbs on level 4
test('Updates on parentPage change', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;

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

    await payload.update({
      collection: 'detailPage',
      data: {
        parentPage: {
          documentId: '',
          slug: '',
        },
      },
      id: level2.id,
    });

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
  });

  await expect(level3Updated!.breadcrumb!.length)
    .toBe(1);
  await expect(level4Updated!.breadcrumb!.length)
    .toBe(2);

});

// 1. Generate 4 levels of nested pages.
// 2. Delete level 2 page
// Expect: 0 breadcrumb on level 3 and 1 breadcrumbs on level 4
test('Updates on page deletion', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;

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

    await payload.delete({
      collection: 'detailPage',
      id: level2.id,
    });

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
  });

  await expect(level3Updated!.breadcrumb!.length)
    .toBe(0);
  await expect(level4Updated!.breadcrumb!.length)
    .toBe(1);

});

// 1. Generate 4 levels of nested pages.
// 2. Unpublish level 2 page
// Expect: 0 breadcrumb on level 3 and 1 breadcrumbs on level 4
test('Updates on unpublishing a page', async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;

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

    await payload.update({
      collection: 'detailPage',
      data: {
        _status: 'draft',
      },
      id: level2.id,
    });

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
  });

  await expect(level3Updated!.breadcrumb!.length)
    .toBe(0);
  await expect(level4Updated!.breadcrumb!.length)
    .toBe(1);

});
