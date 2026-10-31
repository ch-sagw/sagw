/**
 * Pure tests for the per-tenant Fathom site id resolution. No browser.
 */

import {
  expect,
  test,
} from '@playwright/test';
import {
  fathomSites, resolveFathomSiteId,
} from '@/tracking/fathomSites';

const fallbackSiteId = 'FALLBACK';

test.describe('resolveFathomSiteId', () => {
  test.describe('prod', () => {
    test('uses the mapped site id', {
      tag: '@tracking',
    }, () => {
      expect(resolveFathomSiteId({
        env: 'prod',
        fallbackSiteId,
        tenantSlug: 'sagw',
      }))
        .toBe(fathomSites.prod.sagw);
    });

    test('does not track unmapped tenants, even with a fallback', {
      tag: '@tracking',
    }, () => {
      expect(resolveFathomSiteId({
        env: 'prod',
        fallbackSiteId,
        tenantSlug: 'tenant-nobody-configured',
      }))
        .toBeUndefined();
    });

    test('does not track without a tenant', {
      tag: '@tracking',
    }, () => {
      expect(resolveFathomSiteId({
        env: 'prod',
        fallbackSiteId,
        tenantSlug: undefined,
      }))
        .toBeUndefined();
    });
  });

  test.describe('test', () => {
    test('falls back to the shared site for unmapped tenants', {
      tag: '@tracking',
    }, () => {
      expect(resolveFathomSiteId({
        env: 'test',
        fallbackSiteId,
        tenantSlug: 'sagw',
      }))
        .toBe(fallbackSiteId);
    });

    test('is off without fallback', {
      tag: '@tracking',
    }, () => {
      // `undefined` would fall back to the default parameter (process.env)
      expect(resolveFathomSiteId({
        env: 'test',
        fallbackSiteId: '',
        tenantSlug: 'sagw',
      }))
        .toBeUndefined();
    });
  });

  test.describe('playwright', () => {
    test('uses the mapped site id for mapped tenants', {
      tag: '@tracking',
    }, () => {
      expect(resolveFathomSiteId({
        env: 'playwright',
        fallbackSiteId,
        tenantSlug: 'not-sagw',
      }))
        .toBe(fathomSites.playwright['not-sagw']);
    });

    test('uses the shared site for sagw (real-API tests depend on it)', {
      tag: '@tracking',
    }, () => {
      expect(fathomSites.playwright.sagw)
        .toBeUndefined();

      expect(resolveFathomSiteId({
        env: 'playwright',
        fallbackSiteId,
        tenantSlug: 'sagw',
      }))
        .toBe(fallbackSiteId);
    });
  });

  test.describe('local / unknown env', {
    tag: '@tracking',
  }, () => {
    test('falls back to the shared site', () => {
      expect(resolveFathomSiteId({
        env: 'local',
        fallbackSiteId,
        tenantSlug: 'sagw',
      }))
        .toBe(fallbackSiteId);

      expect(resolveFathomSiteId({
        env: undefined,
        fallbackSiteId,
        tenantSlug: 'sagw',
      }))
        .toBe(fallbackSiteId);
    });

    test('is off without fallback', {
      tag: '@tracking',
    }, () => {
      expect(resolveFathomSiteId({
        env: 'local',
        fallbackSiteId: '',
        tenantSlug: 'sagw',
      }))
        .toBeUndefined();
    });
  });
});

test.describe('fathomSites', () => {
  test('prod has the sagw tenant and only non-empty, unique site ids', {
    tag: '@tracking',
  }, () => {
    const ids = Object.values(fathomSites.prod);

    expect(fathomSites.prod.sagw)
      .toBeTruthy();

    ids.forEach((id) => {
      expect(id.trim())
        .not.toBe('');
    });

    expect(new Set(ids).size)
      .toBe(ids.length);
  });

  test('tenant slugs are lower case (they are matched against url slugs)', {
    tag: '@tracking',
  }, () => {
    const slugs = Object.values(fathomSites)
      .flatMap((map) => Object.keys(map));

    expect(slugs)
      .toEqual(slugs.map((slug) => slug.toLowerCase()));
  });
});
