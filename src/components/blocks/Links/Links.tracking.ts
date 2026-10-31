import type { CollectionSlug } from 'payload';
import {
  TRACKING_EVENTS, type TrackingEventPrefix,
} from '@/components/helpers/tracking.constants';

/**
 * Page types whose Links block external links are tracked in Fathom.
 * Links blocks on all other page types are not tracked. See docs/tracking.md.
 */
export const trackedLinksBlockPages: Partial<Record<CollectionSlug, TrackingEventPrefix>> = {
  instituteDetailPage: TRACKING_EVENTS.instituteLink,
  nationalDictionaryDetailPage: TRACKING_EVENTS.nationalDictionaryLink,
};

export const getLinksBlockTrackingPrefix = (sourceCollectionSlug: CollectionSlug | undefined): TrackingEventPrefix | undefined => (sourceCollectionSlug
  ? trackedLinksBlockPages[sourceCollectionSlug]
  : undefined);
