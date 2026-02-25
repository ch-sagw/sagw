import {
  expect,
  test,
} from '@playwright/test';
import {
  generateEventDetailPage,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { deleteSetsPages } from '@/seed/test-data/deleteData';

test.describe('unpublishes past events', () => {
  test('for single day events in the past', async () => {
    await deleteSetsPages();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const todayDateBase = new Date();
    const futureDateBase = new Date();
    const pastDateBase = new Date();
    const todayDate = todayDateBase.setDate(todayDateBase.getDate() + 1);
    const futureDate = futureDateBase.setDate(futureDateBase.getDate() + 1);
    const pastDate = pastDateBase.setDate(pastDateBase.getDate() - 1);

    const futureEvent = await generateEventDetailPage({
      date: (new Date(futureDate))
        .toISOString(),
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event future ${time}`,
    });

    const todayEvent = await generateEventDetailPage({
      date: (new Date(todayDate))
        .toISOString(),
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event today ${time}`,
    });

    const pastEvent = await generateEventDetailPage({
      date: (new Date(pastDate))
        .toISOString(),
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event past ${time}`,
    });

    const queuedJob = await payload.jobs.queue({
      input: {
        forceRun: true,
      },
      queue: 'event-maintenance',
      task: 'unpublishExpiredEventDetailPages',
    });

    await payload.jobs.runByID({
      id: queuedJob.id,
    });

    const futureEventUpdated = await payload.findByID({
      collection: 'eventDetailPage',
      id: futureEvent.id,
    });

    const todayEventUpdated = await payload.findByID({
      collection: 'eventDetailPage',
      id: todayEvent.id,
    });

    const pastEventUpdated = await payload.findByID({
      collection: 'eventDetailPage',
      id: pastEvent.id,
    });

    await expect(futureEventUpdated._status)
      .toEqual('published');

    await expect(todayEventUpdated._status)
      .toEqual('published');

    await expect(pastEventUpdated._status)
      .toEqual('draft');

  });

  test('for multi day events in the past', async () => {
    await deleteSetsPages();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const startDateBase = new Date();
    const todayDateBase = new Date();
    const futureDateBase = new Date();
    const pastDateBase = new Date();
    const startDate = startDateBase.setDate(startDateBase.getDate() + 1);
    const todayDate = todayDateBase.setDate(todayDateBase.getDate() + 1);
    const futureDate = futureDateBase.setDate(futureDateBase.getDate() + 1);
    const pastDate = pastDateBase.setDate(pastDateBase.getDate() - 1);

    const futureEvent = await generateEventDetailPage({
      date: (new Date(startDate))
        .toISOString(),
      dateEnd: (new Date(futureDate))
        .toISOString(),
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event future ${time}`,
    });

    const todayEvent = await generateEventDetailPage({
      date: (new Date(startDate))
        .toISOString(),
      dateEnd: (new Date(todayDate))
        .toISOString(),
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event today ${time}`,
    });

    const pastEvent = await generateEventDetailPage({
      date: (new Date(startDate))
        .toISOString(),
      dateEnd: (new Date(pastDate))
        .toISOString(),
      parentPage: {
        documentId: home,
        slug: 'homePage',
      },
      tenant,
      title: `event past ${time}`,
    });

    const queuedJob = await payload.jobs.queue({
      input: {
        forceRun: true,
      },
      queue: 'event-maintenance',
      task: 'unpublishExpiredEventDetailPages',
    });

    await payload.jobs.runByID({
      id: queuedJob.id,
    });

    const futureEventUpdated = await payload.findByID({
      collection: 'eventDetailPage',
      id: futureEvent.id,
    });

    const todayEventUpdated = await payload.findByID({
      collection: 'eventDetailPage',
      id: todayEvent.id,
    });

    const pastEventUpdated = await payload.findByID({
      collection: 'eventDetailPage',
      id: pastEvent.id,
    });

    await expect(futureEventUpdated._status)
      .toEqual('published');

    await expect(todayEventUpdated._status)
      .toEqual('published');

    await expect(pastEventUpdated._status)
      .toEqual('draft');

  });
});
