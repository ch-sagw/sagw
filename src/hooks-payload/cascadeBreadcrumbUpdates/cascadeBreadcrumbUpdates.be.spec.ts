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

// 1. Generate 4 levels of nested pages.
// 2. Change navigation title on level 2.
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates on navigationTitle change', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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

  await expect(level3Updated!.breadcrumb![2].namede)
    .toStrictEqual('New Level 2 Navigation Title');

  await expect(level4Updated!.breadcrumb![2].namede)
    .toStrictEqual('New Level 2 Navigation Title');

});

// 1. Generate 4 levels of nested pages.
// 2. Change navigation title on level 2.
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates on navigationTitle change in french', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-11`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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

  await expect(level3Updated!.breadcrumb![2].namefr)
    .toStrictEqual('New Level 2 Navigation Title');

  await expect(level4Updated!.breadcrumb![2].namefr)
    .toStrictEqual('New Level 2 Navigation Title');

});

// 1. Generate 4 levels of nested pages.
// 2. Change slug on level 2.
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates on slug change', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();
  const newSlug = `new-slug-level2-${time}`;

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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

  await expect(level3Updated!.breadcrumb![2].slugde)
    .toStrictEqual(newSlug);

  await expect(level4Updated!.breadcrumb![2].slugde)
    .toStrictEqual(newSlug);

});

// 1. Generate 4 levels of nested pages.
// 2. Change slug on level 2.
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates on slug change in french', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();
  const newSlug = `new-slug-level2-${time}`;

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      locale: 'fr',
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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

  await expect(level3Updated!.breadcrumb![2].slugfr)
    .toStrictEqual(newSlug);

  await expect(level4Updated!.breadcrumb![2].slugfr)
    .toStrictEqual(newSlug);

});

// 1. Generate 4 levels of nested pages.
// 2. Change slug on level 2.
// Expect: correct data in level 3 and 4 breadcrumb.
test('Updates after adding slug in other locale', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-2`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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
      },
      id: level4.id,
      locale: 'fr',
    });

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
    locale: 'fr',
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
    locale: 'fr',
  });

  await expect(level3Updated!.breadcrumb![2].slugfr)
    .toStrictEqual(`level-2-fr-${time}`);

  await expect(level4Updated!.breadcrumb![2].slugfr)
    .toStrictEqual(`level-2-fr-${time}`);

  await expect(level4Updated!.breadcrumb![3].slugfr)
    .toStrictEqual(`level-3-fr-${time}`);

});

// 1. Generate 4 levels of nested pages.
// 2. Remove parentPage on level 2
// Expect: 0 breadcrumbs on level 3 and 4
test('Updates on parentPage removal', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-3`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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
    .toBe(0);
  await expect(level4Updated!.breadcrumb!.length)
    .toBe(0);

});

// 1. Generate 4 levels of nested pages.
// 2. Set level 1 as parent of level 3
// Expect: 1 breadcrumb on level 3 and 2 breadcrumbs on level 4
// Expect: correct data on breadcrumb in level 3 and 4.
test('Updates on parentPage update', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-4`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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
    .toBe(2);
  await expect(level4Updated!.breadcrumb!.length)
    .toBe(3);

  await expect(level3Updated!.breadcrumb![0].namede)
    .toStrictEqual('Home DE');

  await expect(level3Updated!.breadcrumb![1].namede)
    .toStrictEqual('Level 1 Navigation Title');

  await expect(level4Updated!.breadcrumb![0].namede)
    .toStrictEqual('Home DE');

  await expect(level4Updated!.breadcrumb![1].namede)
    .toStrictEqual('Level 1 Navigation Title');

  await expect(level4Updated!.breadcrumb![2].namede)
    .toStrictEqual('Level 3 Navigation Title');

});

// 1. Generate 4 levels of nested pages.
// 2. Delete level 2 page
// Expect: 0 breadcrumb on level 3 and 4
test('Updates on page deletion', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-5`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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
    .toBe(0);

});

// 1. Generate 4 levels of nested pages.
// 2. Unpublish level 2 page
// Expect: 0 breadcrumb on level 3 and 4
test('Updates on unpublishing a page', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-6`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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
    .toBe(0);

});

// 1. Generate 4 levels of nested pages.
// 2. Unpublish home
// Expect: 0 breadcrumb on level 1, 2, 3 and 4
test('Updates on unpublishing home', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let level1: any;
  let level2: any;
  let level3: any;
  let level4: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-7`,
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
      navigationTitle: 'Level 2 Navigation Title',
      parentPage: {
        documentId: level1.id,
        slug: 'overviewPage',
      },
      tenant: tenant.id,
      title: `Level 2 ${time}`,
    });

    level3 = await generateEventDetailPage({
      navigationTitle: 'Level 3 Navigation Title',
      parentPage: {
        documentId: level2.id,
        slug: 'detailPage',
      },
      tenant: tenant.id,
      title: `Level 3 ${time}`,
    });

    level4 = await generateInstituteDetailPage({
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

  } catch (e) {
    level4 = JSON.stringify(e);
  }

  const level1Updated = await payload.findByID({
    collection: 'overviewPage',
    id: level1.id,
  });

  const level2Updated = await payload.findByID({
    collection: 'detailPage',
    id: level2.id,
  });

  const level3Updated = await payload.findByID({
    collection: 'eventDetailPage',
    id: level3.id,
  });

  const level4Updated = await payload.findByID({
    collection: 'instituteDetailPage',
    id: level4.id,
  });

  await expect(level1Updated!.breadcrumb!.length)
    .toBe(0);
  await expect(level2Updated!.breadcrumb!.length)
    .toBe(0);
  await expect(level3Updated!.breadcrumb!.length)
    .toBe(0);
  await expect(level4Updated!.breadcrumb!.length)
    .toBe(0);

});

// Discovered during manual test: created overview (home as parent), created
// detail (overview as parent). then added an rte block with plain text to
// home. This lead to the parentPage being emptied on overvew page.
test('Should not overwrite parent field', {
  tag: '@breadcrumb',
}, async () => {
  const payload = await getPayload({
    config: configPromise,
  });

  let home: any;
  let level1: any;
  let level2: any;
  const time = new Date()
    .getTime();

  try {
    const tenant = await generateTenant({
      name: `${time}-tenant-1`,
    });

    home = await generateHomePage({
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
      title: `Level 1 ${time}`,
    });

    level2 = await generateDetailPage({
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

  } catch (e) {
    level2 = JSON.stringify(e);
  }

  const level1Updated = await payload.findByID({
    collection: 'overviewPage',
    id: level1.id,
  });

  const level2Updated = await payload.findByID({
    collection: 'detailPage',
    id: level2.id,
  });

  await expect(level1Updated.parentPage?.slug)
    .toStrictEqual('homePage');
  await expect(level1Updated.parentPage?.documentId)
    .toStrictEqual(home.id);
  await expect(level2Updated.parentPage?.slug)
    .toStrictEqual('overviewPage');
  await expect(level2Updated.parentPage?.documentId)
    .toStrictEqual(level1.id);

});
