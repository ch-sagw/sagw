'use client';

import {
  useEffect, useRef,
} from 'react';
import { useTrackEvent } from '@/components/helpers/useTrackEvent';
import { useTracking } from '@/components/helpers/tracking';
import {
  buildNotFoundLabel, isInternalReferrer,
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
  const tracked = useRef(false);

  useEffect(() => {
    // wait until consent is given (possibly on this very page) and latch
    // only once the event has really been sent
    if (tracked.current || !trackingAllowed || !siteId) {
      return;
    }

    if (!isInternalReferrer(document.referrer, window.location.origin)) {
      return;
    }

    tracked.current = true;

    trackEvents(buildTrackingEvents(
      TRACKING_EVENTS.notFound,
      buildNotFoundLabel({
        pathname: window.location.pathname,
        search: window.location.search,
      }),
      {
        maxLength: TRACKING_EVENT_MAX_LENGTH_URL,
      },
    ));
  }, [
    siteId,
    trackEvents,
    trackingAllowed,
  ]);

  return null;
};
