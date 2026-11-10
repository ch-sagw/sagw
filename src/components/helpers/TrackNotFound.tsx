'use client';

import {
  useEffect, useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import { useTrackEvent } from '@/components/helpers/useTrackEvent';
import { useTracking } from '@/components/helpers/tracking';
import {
  buildNotFoundLabel, cameFromInAppPage, isInternalReferrer,
} from '@/components/helpers/notFoundTracking';
import {
  buildTrackingEvents,
  TRACKING_EVENT_MAX_LENGTH_URL,
  TRACKING_EVENTS,
} from '@/components/helpers/tracking.constants';

/**
 * Fires the `Page not found` events once per 404 render.
 * Must be rendered inside `TrackingProvider`.
 */
export const TrackNotFound = (): null => {
  const trackEvents = useTrackEvent();
  const {
    siteId,
    trackingAllowed,
  } = useTracking();
  const pathname = usePathname();
  const trackedPathname = useRef<string | null>(null);

  useEffect(() => {
    // wait until consent is given (possibly on this very page) and latch
    // only once the event has really been sent, once per missing url
    if (!trackingAllowed || !siteId || !pathname || trackedPathname.current === pathname) {
      return;
    }

    // only 404s reached from one of our own pages: client side navigation
    // or a full page load with a same-origin referrer
    const isInternal = cameFromInAppPage(pathname) ||
      isInternalReferrer(document.referrer, window.location.origin);

    if (!isInternal) {
      return;
    }

    trackedPathname.current = pathname;

    trackEvents(buildTrackingEvents(
      TRACKING_EVENTS.notFound,
      buildNotFoundLabel({
        pathname,
        search: window.location.search,
      }),
      {
        maxLength: TRACKING_EVENT_MAX_LENGTH_URL,
      },
    ));
  }, [
    pathname,
    siteId,
    trackEvents,
    trackingAllowed,
  ]);

  return null;
};
