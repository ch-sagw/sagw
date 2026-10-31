'use client';

import { useCallback } from 'react';
import { trackEvent } from 'fathom-client';
import { useTracking } from '@/components/helpers/tracking';

export type TrackEvents = (eventNames: readonly string[] | undefined) => void;

/**
 * Returns a function that sends the given Fathom events for the current
 * tenant. It is a no-op while tracking is not allowed (globally disabled,
 * no analytics consent, no site id). The site id is passed explicitly so
 * events are always attributed to the right tenant, even while the
 * tracker switches sites during client side navigation.
 */
export const useTrackEvent = (): TrackEvents => {
  const {
    siteId,
    trackingAllowed,
  } = useTracking();

  return useCallback<TrackEvents>((eventNames) => {
    if (!trackingAllowed || !siteId || !eventNames || eventNames.length === 0) {
      return;
    }

    eventNames.forEach((eventName) => {
      if (!eventName) {
        return;
      }

      trackEvent(eventName, {
        /* eslint-disable @typescript-eslint/naming-convention -- Fathom API */
        _site_id: siteId,
        /* eslint-enable @typescript-eslint/naming-convention */
      });
    });
  }, [
    siteId,
    trackingAllowed,
  ]);
};
