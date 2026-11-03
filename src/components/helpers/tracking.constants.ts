/**
 * No `next/*` imports — safe for Playwright (Node) to import.
 * Playwright sets this cookie while `NEXT_PUBLIC_TRACKING_DISABLED` is on.
 */
export const FATHOM_PLAYWRIGHT_E2E_COOKIE_NAME = 'fathom_playwright_e2e';
export const FATHOM_PLAYWRIGHT_E2E_COOKIE_VALUE = '1';

/**
 * Fathom event names. Every interaction fires two events: the category
 * (total) and the category plus the item label, e.g. `Download` and
 * `Download: Jahresbericht 2025`. Fathom cannot rename events once they
 * have been recorded, so treat these strings as frozen. See docs/tracking.md.
 */
export const TRACKING_EVENTS = {
  download: 'Download',
  editionLink: 'Edition link',
  externalEventLink: 'External event link',
  formSubmission: 'Form submission',
  instituteLink: 'Institute link',
  magazineArticleExport: 'Magazine article export',
  nationalDictionaryLink: 'National dictionary link',
  networkLink: 'Network link',
  videoView: 'Video view',
} as const;

export type TrackingEventPrefix = typeof TRACKING_EVENTS[keyof typeof TRACKING_EVENTS];

const TRACKING_EVENT_SEPARATOR = ': ';

export const TRACKING_EVENT_MAX_LENGTH = 100;

// Emoji / pictographs / control chars. Fathom asks to avoid special
// characters and emojis in event names.
const unwantedCharsRegex = /[\p{Extended_Pictographic}\p{Cc}\p{Cf}\uFE0F]/gu;
const htmlTagRegex = /<[^>]*>/gu;
const htmlEntityRegex = /&(?<entity>nbsp|shy|amp|lt|gt|quot|#39|#x27|#8203);/giu;
const whitespaceRegex = /\s+/gu;

const htmlEntityMap: Record<string, string> = {
  '#39': '\'',
  '#8203': '',
  '#x27': '\'',
  'amp': '&',
  'gt': '>',
  'lt': '<',
  'nbsp': ' ',
  'quot': '"',
  'shy': '',
};

/**
 * Turns an HTML string or plain text into a label that is safe for a
 * Fathom event name: tags and entities removed, emojis and control chars
 * removed, whitespace collapsed, trimmed.
 */
export const toTrackingLabel = (raw: string | null | undefined): string => {
  if (!raw) {
    return '';
  }

  return raw
    .replace(htmlTagRegex, ' ')
    .replace(htmlEntityRegex, (_match, entity: string) => htmlEntityMap[entity.toLowerCase()] ?? '')
    .replace(unwantedCharsRegex, '')
    .replace(whitespaceRegex, ' ')
    .trim();
};

/**
 * Builds a Fathom event name from a category prefix and an optional label.
 * Returns `prefix` when the label is empty, otherwise `prefix: label`,
 * capped at `TRACKING_EVENT_MAX_LENGTH` characters.
 */
export const buildTrackingEventName = (prefix: TrackingEventPrefix, label?: string | null): string => {
  const cleanLabel = toTrackingLabel(label);

  if (!cleanLabel) {
    return prefix;
  }

  const name = `${prefix}${TRACKING_EVENT_SEPARATOR}${cleanLabel}`;

  if (name.length <= TRACKING_EVENT_MAX_LENGTH) {
    return name;
  }

  return name.slice(0, TRACKING_EVENT_MAX_LENGTH)
    .trimEnd();
};

/**
 * The pair of events fired for one interaction: the category total and the
 * per-item event. When the label is empty only the category is returned.
 */
export const buildTrackingEvents = (prefix: TrackingEventPrefix, label?: string | null): string[] => {
  const itemEvent = buildTrackingEventName(prefix, label);

  if (itemEvent === prefix) {
    return [prefix];
  }

  return [
    prefix,
    itemEvent,
  ];
};
