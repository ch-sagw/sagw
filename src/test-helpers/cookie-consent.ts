import { test } from '@playwright/test';

/**
 * Value of the `cookie_consent` cookie with all categories accepted.
 * The timestamp must be fresh: the app treats consent older than
 * `CONSENT_DURATION` (see `cookies.ts`) as expired and shows the banner
 * again, which blocks every click on the page behind it.
 */
export const buildConsentCookieValue = ({
  analytics = true,
  external = true,
  timestamp = Date.now(),
}: {
  analytics?: boolean;
  external?: boolean;
  timestamp?: number;
} = {}): string => JSON.stringify({
  analytics,
  consentGiven: true,
  essential: true,
  external,
  timestamp,
});

export const beforeEachAcceptCookies = (): void => {
  test.beforeEach(async ({
    context,
  }) => {
    await context.addCookies([
      {
        domain: 'localhost',
        name: 'cookie_consent',
        path: '/',
        value: buildConsentCookieValue(),
      },
    ]);
  });
};
