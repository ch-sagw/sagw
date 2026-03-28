import { CONSENT_COOKIE_NAME } from '@/components/helpers/cookies';
import {
  FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
  FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
} from '@/components/helpers/tracking.constants';
import { getFathomPageviewTotal } from '@/test-helpers/fathom';
import {
  expect,
  test,
} from '@playwright/test';

const hasTrackingTestCreds = Boolean(process.env.FATHOM_API_KEY &&
  process.env.NEXT_PUBLIC_TRACKING_SITE_ID);

const apiKey = process.env.FATHOM_API_KEY as string;
const siteId = process.env.NEXT_PUBLIC_TRACKING_SITE_ID as string;

// Same window for before/after counts (Fathom `date_from`)
const aggregationLookbackMs = 15 * 60 * 1000;

const sleep = (ms: number): Promise<void> => new Promise((r) => {
  setTimeout(r, ms);
});

// fathom aggregations: 10 req/min; stay under with 7s
const waitForMinPageviewDelta = ({
  beforeCount,
  fathomApiKey,
  fathomSiteId,
  intervalMs,
  minDelta,
  rangeStart,
  timeoutMs,
}: {
  beforeCount: number;
  fathomApiKey: string;
  fathomSiteId: string;
  intervalMs: number;
  minDelta: number;
  rangeStart: Date;
  timeoutMs: number;
}): Promise<number> => {
  const deadline = Date.now() + timeoutMs;

  const poll = async (): Promise<number> => {
    const current = await getFathomPageviewTotal({
      apiKey: fathomApiKey,
      dateFrom: rangeStart,
      siteId: fathomSiteId,
    });

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

  test('does not record pageviews before the user acts on the cookie banner', async ({
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

    await expect(page.getByTestId('consent-banner'))
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

  test('does not record pageviews when the user declines analytics', async ({
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

    const banner = page.getByTestId('consent-banner');

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

  test('records pageviews after the user accepts analytics', async ({
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

    const banner = page.getByTestId('consent-banner');

    await banner.getByText('Alle zulassen')
      .click();
    await expect(banner)
      .not.toBeVisible();

    const delta = await waitForMinPageviewDelta({
      beforeCount: before,
      fathomApiKey: apiKey,
      fathomSiteId: siteId,
      intervalMs: 7000,
      minDelta: 1,
      rangeStart: dateFrom,
      timeoutMs: process.env.CI
        ? 180_000
        : 120_000,
    });

    expect(delta)
      .toBeGreaterThanOrEqual(1);
  });
});
