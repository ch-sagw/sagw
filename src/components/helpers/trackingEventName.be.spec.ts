/**
 * Pure tests for the Fathom event name helpers. No browser involved.
 */

import {
  expect,
  test,
} from '@playwright/test';
import {
  buildTrackingEventName,
  buildTrackingEvents,
  toTrackingLabel,
  TRACKING_EVENT_MAX_LENGTH,
  TRACKING_EVENT_MAX_LENGTH_URL,
  TRACKING_EVENTS,
} from '@/components/helpers/tracking.constants';
import {
  buildNotFoundLabel,
  cameFromInAppPage,
  isInternalReferrer,
  recordVisitedPathname,
} from '@/components/helpers/notFoundTracking';

test.describe('toTrackingLabel', () => {
  test('strips html tags and decodes entities', {
    tag: '@tracking',
  }, () => {
    expect(toTrackingLabel('<p>Hello&nbsp;<strong>World</strong> &amp; friends</p>'))
      .toBe('Hello World & friends');
  });

  test('removes soft hyphens, zero width spaces, emojis and control chars', {
    tag: '@tracking',
  }, () => {
    expect(toTrackingLabel('Schwei&shy;zer&#8203;ische 🎉 Akademie\u0007 \u200B'))
      .toBe('Schweizerische Akademie');
  });

  test('collapses whitespace and trims', {
    tag: '@tracking',
  }, () => {
    expect(toTrackingLabel('  a \n\t b   c  '))
      .toBe('a b c');
  });

  test('returns an empty string for empty input', {
    tag: '@tracking',
  }, () => {
    expect(toTrackingLabel(undefined))
      .toBe('');
    expect(toTrackingLabel(null))
      .toBe('');
    expect(toTrackingLabel('<p></p>'))
      .toBe('');
  });
});

test.describe('buildTrackingEventName', () => {
  test('joins prefix and label', {
    tag: '@tracking',
  }, () => {
    expect(buildTrackingEventName(TRACKING_EVENTS.download, 'Jahresbericht 2024'))
      .toBe('Download: Jahresbericht 2024');
  });

  test('returns only the prefix for an empty label', {
    tag: '@tracking',
  }, () => {
    expect(buildTrackingEventName(TRACKING_EVENTS.download))
      .toBe('Download');
    expect(buildTrackingEventName(TRACKING_EVENTS.download, '<p> </p>'))
      .toBe('Download');
  });

  test('caps the name at the max length without special chars', {
    tag: '@tracking',
  }, () => {
    const name = buildTrackingEventName(TRACKING_EVENTS.videoView, 'x'.repeat(500));

    expect(name.length)
      .toBe(TRACKING_EVENT_MAX_LENGTH);
    expect(name.startsWith('Video view: '))
      .toBe(true);
    expect(name)
      .not.toContain('…');
  });

  test('accepts a custom max length for url labels', {
    tag: '@tracking',
  }, () => {
    const url = `/de/${'x'.repeat(300)}`;
    const name = buildTrackingEventName(TRACKING_EVENTS.notFound, url, {
      maxLength: TRACKING_EVENT_MAX_LENGTH_URL,
    });

    expect(name.length)
      .toBe(TRACKING_EVENT_MAX_LENGTH_URL);
    expect(name.startsWith('Page not found: /de/'))
      .toBe(true);
    expect(TRACKING_EVENT_MAX_LENGTH_URL)
      .toBeGreaterThan(TRACKING_EVENT_MAX_LENGTH);
  });

  test('does not end with whitespace after capping', {
    tag: '@tracking',
  }, () => {
    const label = `${'a'.repeat(TRACKING_EVENT_MAX_LENGTH - 'Form submission: '.length - 1)} b`;
    const name = buildTrackingEventName(TRACKING_EVENTS.formSubmission, label);

    expect(name)
      .toBe(name.trimEnd());
  });

  test('is stable for the same input', {
    tag: '@tracking',
  }, () => {
    const a = buildTrackingEventName(TRACKING_EVENTS.networkLink, '<p>SAGW&nbsp;Netzwerk</p>');
    const b = buildTrackingEventName(TRACKING_EVENTS.networkLink, 'SAGW Netzwerk');

    expect(a)
      .toBe(b);
  });
});

test.describe('buildTrackingEvents', {
  tag: '@tracking',
}, () => {
  test('returns category and item event', () => {
    expect(buildTrackingEvents(TRACKING_EVENTS.editionLink, 'Bulletin 1/24'))
      .toEqual([
        'Edition link',
        'Edition link: Bulletin 1/24',
      ]);
  });

  test('returns only the category when the label is empty', {
    tag: '@tracking',
  }, () => {
    expect(buildTrackingEvents(TRACKING_EVENTS.editionLink, ''))
      .toEqual(['Edition link']);
  });
});

test.describe('404 tracking helpers', () => {
  const origin = 'https://www.sagw.ch';

  test('isInternalReferrer accepts only same-origin referrers', {
    tag: '@tracking',
  }, () => {
    expect(isInternalReferrer(`${origin}/de/some-page`, origin))
      .toBe(true);
    expect(isInternalReferrer('https://www.example.com/', origin))
      .toBe(false);
    expect(isInternalReferrer('https://sagw.ch/de', origin))
      .toBe(false);
    expect(isInternalReferrer('', origin))
      .toBe(false);
    expect(isInternalReferrer('not a url', origin))
      .toBe(false);
  });

  test('cameFromInAppPage is true only after another page was shown', {
    tag: '@tracking',
  }, () => {
    // direct hit on a 404
    expect(cameFromInAppPage('/de/missing'))
      .toBe(false);
    recordVisitedPathname('/de/missing');
    expect(cameFromInAppPage('/de/missing'))
      .toBe(false);

    // client side navigation to the next 404
    expect(cameFromInAppPage('/de/missing-2'))
      .toBe(true);
    recordVisitedPathname('/de/missing-2');
    expect(cameFromInAppPage('/de/missing-2'))
      .toBe(true);
  });

  test('buildNotFoundLabel keeps path and query string', {
    tag: '@tracking',
  }, () => {
    expect(buildNotFoundLabel({
      pathname: '/de/alte-seite',
      search: '?utm_source=newsletter',
    }))
      .toBe('/de/alte-seite?utm_source=newsletter');
  });
});

test.describe('TRACKING_EVENTS', () => {
  test('all category names are unique and free of the separator', {
    tag: '@tracking',
  }, () => {
    const names = Object.values(TRACKING_EVENTS);

    expect(new Set(names).size)
      .toBe(names.length);

    names.forEach((name) => {
      expect(name)
        .not.toContain(':');
    });
  });
});
