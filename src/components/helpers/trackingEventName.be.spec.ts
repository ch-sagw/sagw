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
  TRACKING_EVENTS,
} from '@/components/helpers/tracking.constants';

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
