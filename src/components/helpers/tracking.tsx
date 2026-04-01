'use client';

import {
  consentUpdatedEventName, getCookieConsent,
} from '@/components/helpers/cookies';
import {
  FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
  FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
} from '@/components/helpers/tracking.constants';
import {
  load, trackPageview,
} from 'fathom-client';
import {
  JSX,
  Suspense, useEffect, useRef, useState,
} from 'react';
import {
  usePathname, useSearchParams,
} from 'next/navigation';

const hasPlaywrightTrackingCookie = (): boolean => typeof document !== 'undefined' &&
  document.cookie
    .split('; ')
    .some((row) => row.startsWith(`${FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME}=${FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE}`));

const hasAnalyticsConsent = (): boolean => {
  const consent = getCookieConsent();

  return Boolean(consent?.consentGiven && consent.analytics);
};

const useTrackingGloballyAllowed = (): boolean => {
  const [
    allowed,
    setAllowed,
  ] = useState(() => process.env.NEXT_PUBLIC_TRACKING_DISABLED !== 'true');

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TRACKING_DISABLED !== 'true') {
      return undefined;
    }

    if (hasPlaywrightTrackingCookie()) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setAllowed(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }

    return undefined;
  }, []);

  return allowed;
};

const TrackPageView = (): null => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackingGloballyAllowed = useTrackingGloballyAllowed();
  const [
    analyticsAllowed,
    setAnalyticsAllowed,
  ] = useState(false);
  const fathomLoaded = useRef(false);

  useEffect(() => {
    if (!trackingGloballyAllowed) {
      return undefined;
    }

    const syncConsent = (): void => {
      setAnalyticsAllowed(hasAnalyticsConsent());
    };

    syncConsent();
    window.addEventListener(consentUpdatedEventName, syncConsent);

    return (): void => {
      window.removeEventListener(consentUpdatedEventName, syncConsent);
    };
  }, [trackingGloballyAllowed]);

  useEffect(() => {
    if (!trackingGloballyAllowed || !analyticsAllowed || !process.env.NEXT_PUBLIC_TRACKING_SITE_ID ||
      fathomLoaded.current) {
      return undefined;
    }

    load(process.env.NEXT_PUBLIC_TRACKING_SITE_ID, {
      auto: false,
    });

    fathomLoaded.current = true;

    return undefined;
  }, [
    analyticsAllowed,
    trackingGloballyAllowed,
  ]);

  useEffect(() => {
    if (!trackingGloballyAllowed || !analyticsAllowed || !pathname) {
      return undefined;
    }

    trackPageview({
      referrer: document.referrer,
      url: pathname + searchParams?.toString(),
    });

    return undefined;
  }, [
    analyticsAllowed,
    pathname,
    searchParams,
    trackingGloballyAllowed,
  ]);

  return null;
};

export const Tracking = (): JSX.Element => (
  <Suspense fallback={null}>
    <TrackPageView />
  </Suspense>
);
