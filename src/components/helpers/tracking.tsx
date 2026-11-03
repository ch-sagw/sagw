'use client';

import {
  consentUpdatedEventName, getCookieConsent,
} from '@/components/helpers/cookies';
import {
  FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME,
  FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE,
} from '@/components/helpers/tracking.constants';
import {
  load, setSite, trackPageview,
} from 'fathom-client';
import React, {
  createContext,
  JSX,
  Suspense, useContext, useEffect, useMemo, useState,
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

// --- Context

interface InterfaceTrackingContext {

  /** Fathom site id of the current tenant, `undefined` = tracking disabled */
  siteId: string | undefined;

  /**
   * True when events / pageviews may be sent right now: tracking is not
   * globally disabled, the visitor gave analytics consent and a site id
   * exists. Consumers must not call fathom while this is false, because
   * `fathom-client` queues calls made before the script is loaded and would
   * flush them once consent is given later.
   */
  trackingAllowed: boolean;
}

const TrackingContext = createContext<InterfaceTrackingContext>({
  siteId: undefined,
  trackingAllowed: false,
});

export const useTracking = (): InterfaceTrackingContext => useContext(TrackingContext);

// --- Fathom script + pageviews

const FathomTracker = ({
  siteId,
  trackingAllowed,
}: InterfaceTrackingContext): null => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load the script once and switch the site id whenever the tenant changes
  // (client side navigation between SAGW and another tenant). `load` is a
  // no-op when the script already exists, `setSite` is queued by
  // fathom-client until the script is ready.
  useEffect(() => {
    if (!trackingAllowed || !siteId) {
      return undefined;
    }

    load(siteId, {
      auto: false,
    });

    setSite(siteId);

    return undefined;
  }, [
    siteId,
    trackingAllowed,
  ]);

  // Pageviews. Runs after the effect above (declaration order), so the
  // pageview is always attributed to the current tenant's site.
  useEffect(() => {
    if (!trackingAllowed || !siteId || !pathname) {
      return undefined;
    }

    const query = searchParams?.toString();

    trackPageview({
      referrer: document.referrer,
      url: query
        ? `${pathname}?${query}`
        : pathname,
    });

    return undefined;
  }, [
    pathname,
    searchParams,
    siteId,
    trackingAllowed,
  ]);

  return null;
};

// --- Provider

export const TrackingProvider = ({
  siteId,
  children,
}: {
  siteId: string | undefined;
  children?: React.ReactNode;
}): JSX.Element => {
  const trackingGloballyAllowed = useTrackingGloballyAllowed();
  const [
    analyticsAllowed,
    setAnalyticsAllowed,
  ] = useState(false);

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

  const trackingAllowed = trackingGloballyAllowed && analyticsAllowed && Boolean(siteId);

  const contextValue = useMemo<InterfaceTrackingContext>(() => ({
    siteId,
    trackingAllowed,
  }), [
    siteId,
    trackingAllowed,
  ]);

  return (
    <TrackingContext value={contextValue}>
      <Suspense fallback={null}>
        <FathomTracker
          siteId={siteId}
          trackingAllowed={trackingAllowed}
        />
      </Suspense>
      {children}
    </TrackingContext>
  );
};
