// Invalidate all pages (of tenant) on content change

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateAllPageTypes,
  getHomeId,
} from '@/test-helpers/collections-generator';
import { getTenantId } from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { LogCapture } from '@/test-helpers/capture-logs';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { deleteSetsPages } from '@/seed/test-data/deleteData';
import { allPageInvalidationLogs } from './allPageInvalidationLogs';
import { InterfaceRte } from '@/components/base/types/rte';
import { StatusMessage } from '@/payload-types';

const deleteStatusMessage = async (tenant: string): Promise<void> => {
  const payload = await getPayloadCached();

  const statusMessage = await payload.find({
    collection: 'statusMessage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  if (statusMessage.docs.length !== 1) {
    return;
  }

  await payload.delete({
    collection: 'statusMessage',
    id: statusMessage.docs[0].id,
  });
};

const createStatusMesssage = async ({
  display,
  message,
  showOnHomeOnly,
  tenant,
  title,
  type,
}: {
  display: 'show' | 'hide',
  message: InterfaceRte;
  showOnHomeOnly: boolean;
  tenant: string;
  title: InterfaceRte,
  type: 'error' | 'warn' | 'success',
}): Promise<StatusMessage> => {
  const payload = await getPayloadCached();

  const statusMessage = await payload.create({
    collection: 'statusMessage',
    context: {
      skipCacheInvalidation: true,
    },
    data: {
      content: {
        message,
        optionalLink: {
          includeLink: true,
          link: {
            internalLink: {
              documentId: '12345',
              slug: 'some-slug',
            },
            linkText: simpleRteConfig('Some action link'),
          },
        },
        show: {
          display,
        },
        showOnHomeOnly,
        title,
        type,
      },
      tenant,
    },
  });

  return statusMessage;
};

test.describe('status message content', () => {
  test('invalidates all pages of current tenant (only!) on content change (sagw) (homeOnly unchecked)', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    // sagw content
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // non-sagw content
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateAllPageTypes({
      home: homeNonSagw,
      iterator: 2,
      tenant: tenantNonSagw,
      time,
    });

    // get statusMessage
    await deleteStatusMessage(tenant);
    const statusMessage = await createStatusMesssage({
      display: 'show',
      message: simpleRteConfig('message'),
      showOnHomeOnly: false,
      tenant,
      title: simpleRteConfig('title'),
      type: 'warn',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          message: simpleRteConfig('Eigentlich undenkbar, aber trotzdem passiert. Bitte entschuldigen Sie die Unannehmlichkeiten und versuchen Sie es später erneut changed'),
          showOnHomeOnly: false,
        },
      },
      id: statusMessage.id,
    });

    logCapture.detachLogs();

    allPageInvalidationLogs({
      isSagw: true,
      time,
    })
      .forEach((log) => {
        expect(logCapture.hasLog(log))
          .toBe(true);
      });

    expect(logCapture.logs)
      .toHaveLength(30);

  });

  test('invalidates all pages of current tenant (only!) on content change (sagw) (homeOnly checked)', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    // sagw content
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // non-sagw content
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateAllPageTypes({
      home: homeNonSagw,
      iterator: 2,
      tenant: tenantNonSagw,
      time,
    });

    // get statusMessage
    // get statusMessage
    await deleteStatusMessage(tenant);
    const statusMessage = await createStatusMesssage({
      display: 'show',
      message: simpleRteConfig('message'),
      showOnHomeOnly: true,
      tenant,
      title: simpleRteConfig('title'),
      type: 'warn',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          message: simpleRteConfig('Eigentlich undenkbar, aber trotzdem passiert. Bitte entschuldigen Sie die Unannehmlichkeiten und versuchen Sie es später erneut changed'),
          showOnHomeOnly: true,
        },
      },
      id: statusMessage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog('[CACHE] invalidating path: /de'))
      .toBe(true);
    expect(logCapture.hasLog('[CACHE] invalidating path: /fr'))
      .toBe(true);
    expect(logCapture.hasLog('[CACHE] invalidating path: /it'))
      .toBe(true);
    expect(logCapture.hasLog('[CACHE] invalidating path: /en'))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(4);

  });

  test('invalidates all pages of current tenant (only!) on content change (non-sagw) (homeOnly unchecked)', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    // sagw content
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // non-sagw content
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateAllPageTypes({
      home: homeNonSagw,
      iterator: 2,
      tenant: tenantNonSagw,
      time,
    });

    // get statusMessage
    await deleteStatusMessage(tenant);
    const statusMessage = await createStatusMesssage({
      display: 'show',
      message: simpleRteConfig('message'),
      showOnHomeOnly: false,
      tenant: tenantNonSagw,
      title: simpleRteConfig('title'),
      type: 'warn',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          message: simpleRteConfig('changed'),
        },
      },
      id: statusMessage.id,
    });

    logCapture.detachLogs();

    allPageInvalidationLogs({
      isSagw: false,
      time,
    })
      .forEach((log) => {
        expect(logCapture.hasLog(log))
          .toBe(true);
      });

    expect(logCapture.logs)
      .toHaveLength(31);

  });

  test('invalidates all pages of current tenant (only!) on content change (non-sagw) (homeOnly checked)', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    // sagw content
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // non-sagw content
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateAllPageTypes({
      home: homeNonSagw,
      iterator: 2,
      tenant: tenantNonSagw,
      time,
    });

    // get statusMessage
    await deleteStatusMessage(tenant);
    const statusMessage = await createStatusMesssage({
      display: 'show',
      message: simpleRteConfig('message'),
      showOnHomeOnly: true,
      tenant: tenantNonSagw,
      title: simpleRteConfig('title'),
      type: 'warn',
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          message: simpleRteConfig('changed'),
        },
      },
      id: statusMessage.id,
    });

    logCapture.detachLogs();

    expect(logCapture.hasLog(`[CACHE] invalidating path: /de/tenant-${time}`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /fr/tenant-${time}-fr`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /it/tenant-${time}-it`))
      .toBe(true);
    expect(logCapture.hasLog(`[CACHE] invalidating path: /en/tenant-${time}-en`))
      .toBe(true);

    expect(logCapture.logs)
      .toHaveLength(4);

  });
});

test.describe('status message various properties', () => {

  // cache issue on prod solved: clear invalidation cache survives multiple
  // admin edits. in playwright, this state is flusehd from test to test,
  // on prod it might not be. so we need to simulate this behaviour in our
  // tests here.

  test('display changes form hide to show', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    // sagw content
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // non-sagw content
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateAllPageTypes({
      home: homeNonSagw,
      iterator: 2,
      tenant: tenantNonSagw,
      time,
    });

    // get statusMessage
    await deleteStatusMessage(tenant);
    const statusMessage = await createStatusMesssage({
      display: 'show',
      message: simpleRteConfig('message'),
      showOnHomeOnly: false,
      tenant,
      title: simpleRteConfig('title'),
      type: 'warn',
    });

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          show: {
            display: 'hide',
          },
        },
      },
      id: statusMessage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          show: {
            display: 'show',
          },
        },
      },
      id: statusMessage.id,
    });

    logCapture.detachLogs();

    allPageInvalidationLogs({
      isSagw: true,
      time,
    })
      .forEach((log) => {
        expect(logCapture.hasLog(log))
          .toBe(true);
      });

    expect(logCapture.logs)
      .toHaveLength(30);

  });

  test('display changes form show to hide', {
    tag: '@cache',
  }, async () => {
    await deleteSetsPages();

    const logCapture = new LogCapture();
    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    // sagw content
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    await generateAllPageTypes({
      home,
      iterator: 1,
      tenant,
      time,
    });

    // non-sagw content
    const tenantNonSagw = await getTenantId({
      isSagw: false,
      time,
    });

    const homeNonSagw = await getHomeId({
      isSagw: false,
      tenant: tenantNonSagw,
    });

    await generateAllPageTypes({
      home: homeNonSagw,
      iterator: 2,
      tenant: tenantNonSagw,
      time,
    });

    // get statusMessage
    await deleteStatusMessage(tenant);
    const statusMessage = await createStatusMesssage({
      display: 'hide',
      message: simpleRteConfig('message'),
      showOnHomeOnly: false,
      tenant,
      title: simpleRteConfig('title'),
      type: 'warn',
    });

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          show: {
            display: 'show',
          },
        },
      },
      id: statusMessage.id,
    });

    logCapture.captureLogs();

    await payload.update({
      collection: 'statusMessage',
      data: {
        ...statusMessage,
        content: {
          ...statusMessage.content,
          show: {
            display: 'hide',
          },
        },
      },
      id: statusMessage.id,
    });

    logCapture.detachLogs();

    allPageInvalidationLogs({
      isSagw: true,
      time,
    })
      .forEach((log) => {
        expect(logCapture.hasLog(log))
          .toBe(true);
      });

    expect(logCapture.logs)
      .toHaveLength(30);

  });
});
