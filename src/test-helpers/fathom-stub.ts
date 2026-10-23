import {
  expect, type Page,
} from '@playwright/test';
import { CONSENT_COOKIE_NAME } from '@/components/helpers/cookies';
import {
  FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
  FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
} from '@/components/helpers/tracking.constants';

/**
 * Deterministic Fathom test double.
 *
 * `installFathomStub` intercepts the request for the Fathom script and
 * serves a tiny stub which records every call (`trackPageview`,
 * `trackEvent`, `setSite`, ...) plus the `data-site` of the script tag into
 * `window.__fathomCalls`. Nothing is sent to Fathom, no credentials and no
 * rate limits are involved. `tracking.be.spec.ts` still talks to the real
 * Fathom API as an end-to-end smoke test.
 */

const FATHOM_SCRIPT_URL = 'https://cdn.usefathom.com/script.js';

/* eslint-disable @typescript-eslint/naming-convention -- Fathom API */
type FathomStubCall =
  | { type: 'load'; siteId: string | null }
  | { type: 'setSite'; siteId: string }
  | { type: 'trackPageview'; opts?: { url?: string; referrer?: string } }
  | { type: 'trackEvent'; name: string; opts?: { _site_id?: string; _value?: number } }
  | { type: 'trackGoal' | 'blockTrackingForMe' | 'enableTrackingForMe' };

interface InterfaceFathomStubWindow {
  __fathomCalls?: unknown[];
}
/* eslint-enable @typescript-eslint/naming-convention */

interface InterfaceTrackedEvent {
  name: string;
  siteId: string | undefined;
}

// Executed in the browser in place of the real Fathom script.
const stubScript = `
(function () {
  var script = document.getElementById('fathom-script');
  var calls = window.__fathomCalls = window.__fathomCalls || [];

  calls.push({ type: 'load', siteId: script ? script.getAttribute('data-site') : null });

  window.fathom = {
    trackPageview: function (opts) { calls.push({ type: 'trackPageview', opts: opts }); },
    trackEvent: function (name, opts) { calls.push({ type: 'trackEvent', name: name, opts: opts }); },
    trackGoal: function () { calls.push({ type: 'trackGoal' }); },
    setSite: function (id) { calls.push({ type: 'setSite', siteId: id }); },
    blockTrackingForMe: function () { calls.push({ type: 'blockTrackingForMe' }); },
    enableTrackingForMe: function () { calls.push({ type: 'enableTrackingForMe' }); }
  };
})();
`;

const installFathomStub = async (page: Page): Promise<void> => {
  await page.route(`${FATHOM_SCRIPT_URL}*`, async (route) => {
    await route.fulfill({
      body: stubScript,
      contentType: 'application/javascript',
      status: 200,
    });
  });
};

/**
 * Prevents anchors from navigating (the React click handlers still run), so
 * clicking tracked links in tests neither opens new tabs for external URLs
 * nor leaves the page (which would reset `window.__fathomCalls`).
 */
export const preventLinkNavigation = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');

      if (anchor) {
        event.preventDefault();
      }
    }, true);
  });
};

const getFathomCalls = (page: Page): Promise<FathomStubCall[]> => page.evaluate(() => {
  const win = window as unknown as InterfaceFathomStubWindow;

  return (win.__fathomCalls || []) as never[];
});

export const getTrackedEvents = async (page: Page): Promise<InterfaceTrackedEvent[]> => {
  const calls = await getFathomCalls(page);

  return calls
    .filter((call): call is Extract<FathomStubCall, { type: 'trackEvent' }> => call.type === 'trackEvent')
    .map((call) => ({
      name: call.name,
      siteId: call.opts?._site_id,
    }));
};

export const getTrackedEventNames = async (page: Page): Promise<string[]> => (await getTrackedEvents(page)).map((event) => event.name);

export const getLoadedSiteIds = async (page: Page): Promise<(string | null)[]> => {
  const calls = await getFathomCalls(page);

  return calls
    .filter((call): call is Extract<FathomStubCall, { type: 'load' }> => call.type === 'load')
    .map((call) => call.siteId);
};

export const getSetSiteIds = async (page: Page): Promise<string[]> => {
  const calls = await getFathomCalls(page);

  return calls
    .filter((call): call is Extract<FathomStubCall, { type: 'setSite' }> => call.type === 'setSite')
    .map((call) => call.siteId);
};

export const getPageviewCount = async (page: Page): Promise<number> => {
  const calls = await getFathomCalls(page);

  return calls.filter((call) => call.type === 'trackPageview').length;
};

/** Waits until the stub has been loaded by the page (script executed). */
export const waitForFathomStub = async (page: Page): Promise<void> => {
  await expect.poll(async () => (await getLoadedSiteIds(page)).length, {
    timeout: 15_000,
  })
    .toBeGreaterThan(0);
};

/** Waits until all given event names have been tracked at least once. */
export const expectTrackedEvents = async (page: Page, expectedNames: string[]): Promise<void> => {
  await expect.poll(async () => {
    const names = await getTrackedEventNames(page);

    return expectedNames.every((expected) => names.includes(expected));
  }, {
    message: `Expected Fathom events: ${expectedNames.join(' | ')}`,
    timeout: 10_000,
  })
    .toBe(true);
};

/**
 * Cookies for tracking tests: analytics consent given and the Playwright
 * cookie which re-enables the tracker while NEXT_PUBLIC_TRACKING_DISABLED is
 * on (see tracking.tsx).
 */
const addTrackingCookies = async (page: Page, {
  analytics = true,
  consentGiven = true,
}: {
  analytics?: boolean;
  consentGiven?: boolean;
} = {}): Promise<void> => {
  await page.context()
    .clearCookies({
      domain: 'localhost',
      name: CONSENT_COOKIE_NAME,
    });

  const cookies = [
    {
      domain: 'localhost',
      name: FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
      path: '/',
      value: FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
    },
  ];

  if (consentGiven) {
    cookies.push({
      domain: 'localhost',
      name: CONSENT_COOKIE_NAME,
      path: '/',
      value: JSON.stringify({
        analytics,
        consentGiven: true,
        essential: true,
        external: true,
        timestamp: Date.now(),
      }),
    });
  }

  await page.context()
    .addCookies(cookies);
};

/** One-stop setup for a tracking test page. */
export const setupTrackingPage = async (page: Page, options?: {
  analytics?: boolean;
  consentGiven?: boolean;
  preventNavigation?: boolean;
}): Promise<void> => {
  await installFathomStub(page);

  if (options?.preventNavigation !== false) {
    await preventLinkNavigation(page);
  }

  await addTrackingCookies(page, options);
};
