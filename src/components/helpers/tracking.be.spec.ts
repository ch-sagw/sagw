import { CONSENT_COOKIE_NAME } from '@/components/helpers/cookies';
import {
  FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
  FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
  TRACKING_EVENTS,
} from '@/components/helpers/tracking.constants';
import {
  getFathomEventTotal, getFathomPageviewTotal,
} from '@/test-helpers/fathom';
import {
  generateDetailPage, generateDocument,
} from '@/test-helpers/collections-generator';
import { getTenant } from '@/test-helpers/tenant-generator';
import { resolveFathomSiteId } from '@/tracking/fathomSites';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  expect,
  test,
} from '@playwright/test';

// The `sagw` tenant uses the shared playwright site (not in the playwright
// map), so the real API can be queried with NEXT_PUBLIC_TRACKING_SITE_ID.
const siteId = resolveFathomSiteId({
  tenantSlug: 'sagw',
}) as string;

const hasTrackingTestCreds = Boolean(process.env.FATHOM_API_KEY && siteId);

const apiKey = process.env.FATHOM_API_KEY as string;

// Same window for before/after counts (Fathom `date_from`)
const aggregationLookbackMs = 15 * 60 * 1000;

const sleep = (ms: number): Promise<void> => new Promise((r) => {
  setTimeout(r, ms);
});

// fathom aggregations: 10 req/min; stay under with 7s
const waitForMinDelta = ({
  beforeCount,
  getCount,
  intervalMs,
  minDelta,
  timeoutMs,
}: {
  beforeCount: number;
  getCount: () => Promise<number>;
  intervalMs: number;
  minDelta: number;
  timeoutMs: number;
}): Promise<number> => {
  const deadline = Date.now() + timeoutMs;

  const poll = async (): Promise<number> => {
    const current = await getCount();

    const delta = current - beforeCount;

    if (delta >= minDelta) {
      return delta;
    }

    if (Date.now() >= deadline) {
      return delta;
    }

    await sleep(intervalMs);

    return poll();
  };

  return poll();
};

test.describe.configure({
  mode: 'serial',
});

test.describe('Tracking', () => {
  test.skip(
    !hasTrackingTestCreds,
    'Requires FATHOM_API_KEY and NEXT_PUBLIC_TRACKING_SITE_ID.',
  );

  test.beforeEach(async ({
    context,
  }) => {

    await context.clearCookies({
      domain: 'localhost',
      name: CONSENT_COOKIE_NAME,
    });

    // `NEXT_PUBLIC_TRACKING_DISABLED` stays true in `.env.playwright`; this
    // cookie re-enables the tracker only for this file (see `tracking.tsx`).
    await context.addCookies([
      {
        domain: 'localhost',
        name: FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
        path: '/',
        value: FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
      },
    ]);
  });

  test('does not record pageviews before the user acts on the cookie banner', {
    tag: '@tracking',
  }, async ({
    page,
  }) => {
    const dateFrom = new Date(Date.now() - aggregationLookbackMs);
    const before = await getFathomPageviewTotal({
      apiKey,
      dateFrom,
      siteId,
    });

    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByTestId('pb7q2x'))
      .toBeVisible();

    await sleep(10_000);
    const after = await getFathomPageviewTotal({
      apiKey,
      dateFrom,
      siteId,
    });

    expect(after)
      .toBe(before);
  });

  test('does not record pageviews when the user declines analytics', {
    tag: '@tracking',
  }, async ({
    page,
  }) => {
    const dateFrom = new Date(Date.now() - aggregationLookbackMs);
    const before = await getFathomPageviewTotal({
      apiKey,
      dateFrom,
      siteId,
    });

    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = page.getByTestId('pb7q2x');

    await banner.getByText('Alle ablehnen')
      .click();
    await expect(banner)
      .not.toBeVisible();

    await sleep(10_000);
    const after = await getFathomPageviewTotal({
      apiKey,
      dateFrom,
      siteId,
    });

    expect(after)
      .toBe(before);
  });

  test('records pageviews after the user accepts analytics', {
    tag: '@tracking',
  }, async ({
    page,
  }) => {
    const dateFrom = new Date(Date.now() - aggregationLookbackMs);
    const before = await getFathomPageviewTotal({
      apiKey,
      dateFrom,
      siteId,
    });

    await page.goto('http://localhost:3000/de');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = page.getByTestId('pb7q2x');

    await banner.getByText('Alle zulassen')
      .click();
    await expect(banner)
      .not.toBeVisible();

    const delta = await waitForMinDelta({
      beforeCount: before,
      getCount: () => getFathomPageviewTotal({
        apiKey,
        dateFrom,
        siteId,
      }),
      intervalMs: 7000,
      minDelta: 1,
      timeoutMs: process.env.CI
        ? 180_000
        : 120_000,
    });

    expect(delta)
      .toBeGreaterThanOrEqual(1);
  });

  // Smoke test for the event pipeline against the real API. The individual
  // events are covered (stubbed) in `tracking-events.be.spec.ts`.
  test('records a Download event after the user accepts analytics', {
    tag: '@tracking',
  }, async ({
    page,
  }) => {
    const tenant = (await getTenant()) || '';
    const payload = await getPayloadCached();
    const home = await payload.find({
      collection: 'homePage',
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });
    const time = Date.now();
    const documentId = await generateDocument(tenant, undefined, `Fathom smoke ${time}`);

    await generateDetailPage({
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'documents',
              value: documentId,
            },
          ],
        },
      ],
      parentPage: {
        documentId: home.docs[0].id,
        slug: 'homePage',
      },
      tenant,
      title: `fathom smoke ${time}`,
    });

    const dateFrom = new Date(Date.now() - aggregationLookbackMs);
    const getCount = (): Promise<number> => getFathomEventTotal({
      apiKey,
      dateFrom,
      eventName: TRACKING_EVENTS.download,
      siteId,
    });
    const before = await getCount();

    await page.goto(`http://localhost:3000/de/fathom-smoke-${time}`);
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    const banner = page.getByTestId('pb7q2x');

    await banner.getByText('Alle zulassen')
      .click();
    await expect(banner)
      .not.toBeVisible();

    // let the (now consented) tracker load before clicking
    await sleep(2000);

    await page.getByTestId('downloadLinkItem')
      .first()
      .click();

    // the click opens the pdf in a new tab, the page itself stays
    await sleep(2000);

    const delta = await waitForMinDelta({
      beforeCount: before,
      getCount,
      intervalMs: 7000,
      minDelta: 1,
      timeoutMs: process.env.CI
        ? 180_000
        : 120_000,
    });

    expect(delta)
      .toBeGreaterThanOrEqual(1);
  });
});
