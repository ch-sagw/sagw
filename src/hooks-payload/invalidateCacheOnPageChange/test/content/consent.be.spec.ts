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

test('invalidates all pages of current tenant (only!) on content change (sagw)', {
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

  // get consent
  const consent = await payload.find({
    collection: 'consent',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
        buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
        text: simpleRteConfig('text'),
        title: simpleRteConfig('Diese Webseite verwendet Cookies'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.'),
          title: simpleRteConfig('Analytics und Performance'),
          toggleDefault: 'off',
          toggleLabelOff: simpleRteConfig('Aus'),
          toggleLabelOn: simpleRteConfig('An'),
        },
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonAcceptSelection: simpleRteConfig('Auswahl zulassen'),
        externalContent: {
          text: simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).'),
          title: simpleRteConfig('Externe Inhalte'),
          toggleDefault: 'off',
          toggleLabelOff: simpleRteConfig('Aus'),
          toggleLabelOn: simpleRteConfig('An'),
        },
        necessaryCookies: {
          text: simpleRteConfig('Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.'),
          title: simpleRteConfig('Notwendige Cookies'),
          toggleLabel: simpleRteConfig('Immer an'),
        },
        text: simpleRteConfig('Sie haben die volle Kontrolle über Ihre Privatsphäre und entscheiden selbst, welche Cookies wir verwenden dürfen und welche nicht.'),
        title: simpleRteConfig('Cookies Einstellungen'),
      },
      tenant,
    },
    id: consent.docs[0].id,
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

test('invalidates all pages of current tenant (only!) on content change (non-sagw)', {
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

  // get consent
  const consent = await payload.find({
    collection: 'consent',
    where: {
      tenant: {
        equals: tenantNonSagw,
      },
    },
  });

  logCapture.captureLogs();

  await payload.update({
    collection: 'consent',
    data: {
      ...consent.docs[0],
      banner: {
        ...consent.docs[0].banner,
        buttonAcceptAll: simpleRteConfig('Alle zulassen changed'),
      },
      tenant: tenantNonSagw,
    },
    id: consent.docs[0].id,
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
