/* eslint-disable @typescript-eslint/naming-convention */
import {
  type APIRequestContext,
  expect,
  test,
} from '@playwright/test';
import type { Payload } from 'payload';
import {
  deleteOtherCollections, deleteSetsPages, deleteTenants,
} from '@/seed/test-data/deleteData';
import {
  generateDataPrivacyPage,
  generateDetailPageInAllLocales,
  generateOverviewPageInAllLocales,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  enableAllTenantLanguages, generateTenant, getTenantId,
} from '@/test-helpers/tenant-generator';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { fetchDetailPages } from '@/data/fetch';
import { getPageUrl } from '@/utilities/getPageUrl';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { seoData } from '@/seed/test-data/seoData';

const baseUrl = 'http://localhost:3000';

type RawDoc = Record<string, any> & { id: string };

type LoginType = 'super-admin' | 'translator';

const loginToken = async ({
  payload,
  type,
}: {
  payload: Payload;
  type: LoginType;
}): Promise<string> => {
  const email = type === 'super-admin'
    ? process.env.USER_SUPER_ADMIN_MAIL
    : process.env.USER_TRANSLATOR_MAIL;
  const password = type === 'super-admin'
    ? process.env.USER_SUPER_ADMIN_PASS
    : process.env.USER_TRANSLATOR_PASS;

  if (!email || !password) {
    throw new Error('No login credentials');
  }

  const {
    token,
  } = await payload.login({
    collection: 'users',
    data: {
      email,
      password,
    },
  });

  if (!token) {
    throw new Error('Login failed: no token');
  }

  return token;
};

const postDeleteLocale = async ({
  collection,
  id,
  locale,
  request,
  token,
}: {
  collection: string;
  id: string;
  locale: string;
  request: APIRequestContext;
  token?: string;
}): Promise<{ status: number; body: any }> => {
  const response = await request.post(`${baseUrl}/api/${collection}/${id}/delete-locale`, {
    data: {
      locale,
    },
    headers: {
      ...(token
        ? {
          Authorization: `JWT ${token}`,
        }
        : {
          // the playwright env enables payload's admin.autoLogin, which
          // would log in token-less requests. this header disables it.
          DisableAutologin: 'true',
        }),
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json()
    .catch(() => ({}));

  return {
    body,
    status: response.status(),
  };
};

// fetches a frontend page and returns its html (empty string on error)
const fetchHtml = async ({
  path,
  request,
}: {
  path: string;
  request: APIRequestContext;
}): Promise<string> => {
  const response = await request.get(`${baseUrl}${path}`);

  return response.text();
};

const rawLocalized = (doc: Record<string, any> | null, path: string[]): Record<string, unknown> | undefined => {
  let current: any = doc;

  for (const segment of path) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }

    current = current[segment];
  }

  return current;
};

test.describe('deleteLocaleVariant', () => {
  test.describe.configure({
    mode: 'serial',
  });

  test('removes one locale from the document and all its versions, hides it on the frontend, and allows re-adding', async ({
    request,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    // the endpoint rejects locales disabled on the tenant; an earlier test
    // may have disabled fr on the sagw tenant.
    await enableAllTenantLanguages(tenant);

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const overview = await generateOverviewPageInAllLocales({
      parentCollection: 'homePage',
      parentId: home,
      tenant,
      title: `overview ${time}`,
    });

    // generateDetailPageInAllLocales creates the page and updates it three
    // times -> several versions, each holding content in all locales.
    const detail = await generateDetailPageInAllLocales({
      parentCollection: 'overviewPage',
      parentId: overview.id,
      tenant,
      title: `detail ${time}`,
    });

    const rawBefore = await payload.db.findOne<RawDoc>({
      collection: 'detailPage',
      where: {
        id: {
          equals: detail.id,
        },
      },
    });

    expect(rawBefore)
      .not.toBeNull();

    const slugBefore = rawLocalized(rawBefore, ['slug']) as Record<string, string>;

    expect(slugBefore.fr)
      .toBeTruthy();
    expect(slugBefore.de)
      .toBeTruthy();

    const frSlug = slugBefore.fr;
    const deSlug = slugBefore.de;

    const versionsBefore = await payload.db.findVersions<Record<string, any>>({
      collection: 'detailPage',
      limit: 0,
      pagination: false,
      where: {
        parent: {
          equals: detail.id,
        },
      },
    });

    expect(versionsBefore.docs.length)
      .toBeGreaterThan(1);

    const versionsWithFrBefore = versionsBefore.docs.filter((version) => Boolean(rawLocalized(version.version, [
      'hero',
      'title',
    ])?.fr));

    expect(versionsWithFrBefore.length)
      .toBeGreaterThan(0);

    // ------------------------------------------------------------------
    // frontend visible in fr before deletion
    // ------------------------------------------------------------------
    const frPath = await getPageUrl({
      absolute: false,
      locale: 'fr',
      pageId: detail.id,
      payload,
    });
    const dePath = await getPageUrl({
      absolute: false,
      locale: 'de',
      pageId: detail.id,
      payload,
    });

    expect(frPath)
      .toContain(frSlug);
    expect(dePath)
      .toContain(deSlug);

    const frHtmlBefore = await fetchHtml({
      path: frPath,
      request,
    });

    expect(frHtmlBefore)
      .toContain(`detail ${time} fr`);

    // ------------------------------------------------------------------
    // delete fr
    // ------------------------------------------------------------------
    const token = await loginToken({
      payload,
      type: 'super-admin',
    });

    const result = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'fr',
      request,
      token,
    });

    expect(result.status)
      .toBe(200);
    expect(result.body.locale)
      .toBe('fr');
    expect(result.body.versionsUpdated)
      .toBe(versionsBefore.docs.length);

    // ------------------------------------------------------------------
    // main document: fr gone, other locales intact
    // ------------------------------------------------------------------
    const rawAfter = await payload.db.findOne<RawDoc>({
      collection: 'detailPage',
      where: {
        id: {
          equals: detail.id,
        },
      },
    });

    const slugAfter = rawLocalized(rawAfter, ['slug']) as Record<string, string>;
    const heroTitleAfter = rawLocalized(rawAfter, [
      'hero',
      'title',
    ]) as Record<string, unknown>;

    expect(slugAfter.fr)
      .toBeUndefined();
    expect(slugAfter.de)
      .toBe(deSlug);
    expect(slugAfter.it)
      .toBe(slugBefore.it);
    expect(slugAfter.en)
      .toBe(slugBefore.en);
    expect(heroTitleAfter.fr)
      .toBeUndefined();
    expect(heroTitleAfter.de)
      .toBeTruthy();
    expect(heroTitleAfter.it)
      .toBeTruthy();
    expect(rawAfter?._status)
      .toBe('published');

    // ------------------------------------------------------------------
    // versions: fr purged everywhere
    // ------------------------------------------------------------------
    const versionsAfter = await payload.db.findVersions<Record<string, any>>({
      collection: 'detailPage',
      limit: 0,
      pagination: false,
      where: {
        parent: {
          equals: detail.id,
        },
      },
    });

    expect(versionsAfter.docs.length)
      .toBe(versionsBefore.docs.length);

    for (const version of versionsAfter.docs) {
      expect(rawLocalized(version.version, [
        'hero',
        'title',
      ])?.fr)
        .toBeUndefined();
      expect(rawLocalized(version.version, ['slug'])?.fr)
        .toBeUndefined();
    }

    // at least one version still has german content
    expect(versionsAfter.docs.some((version) => Boolean(rawLocalized(version.version, [
      'hero',
      'title',
    ])?.de)))
      .toBe(true);

    // ------------------------------------------------------------------
    // frontend: the fr URL no longer resolves (no slug.fr), de still works
    // ------------------------------------------------------------------
    const frHtmlAfter = await fetchHtml({
      path: frPath,
      request,
    });

    // neither the fr content nor the german fallback may be rendered
    expect(frHtmlAfter)
      .not.toContain(`detail ${time}`);

    const deHtmlAfter = await fetchHtml({
      path: dePath,
      request,
    });

    expect(deHtmlAfter)
      .toContain(`detail ${time} de`);

    // the page now behaves like a page that was never translated to fr:
    // payload's locale fallback still lists it (with german content) in
    // fr teaser queries, and its fr url falls back to another locale.
    const frList = await fetchDetailPages({
      collection: 'detailPage',
      language: 'fr',
      payload,
      sort: '-createdAt',
      tenant,
    });

    expect(frList.map((doc) => doc.id))
      .toContain(detail.id);

    const frUrl = await getPageUrl({
      absolute: false,
      locale: 'fr',
      pageId: detail.id,
      payload,
    });

    expect(frUrl)
      .not.toContain(frSlug);

    // ------------------------------------------------------------------
    // re-adding: publishing new fr content makes the page resolvable again
    // ------------------------------------------------------------------
    const newFrSlug = `${frSlug}-neu`;

    await payload.update({
      collection: 'detailPage',
      data: {
        _status: 'published',
        hero: {
          title: simpleRteConfig(`detail ${time} fr neu`),
        },
        navigationTitle: 'title fr neu',
        slug: newFrSlug,
        ...seoData,
      },
      id: detail.id,
      locale: 'fr',
    });

    const frPathReadded = await getPageUrl({
      absolute: false,
      locale: 'fr',
      pageId: detail.id,
      payload,
    });

    expect(frPathReadded)
      .toContain(newFrSlug);

    const frHtmlReadded = await fetchHtml({
      path: frPathReadded,
      request,
    });

    expect(frHtmlReadded)
      .toContain(`detail ${time} fr neu`);
  });

  test('guards: default locale, unknown locale, missing user, translator, non-eligible collections', async ({
    request,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await getTenantId({
      isSagw: true,
      time,
    });

    // the endpoint rejects locales disabled on the tenant; an earlier test
    // may have disabled fr on the sagw tenant.
    await enableAllTenantLanguages(tenant);

    const home = await getHomeId({
      isSagw: true,
      tenant,
    });

    const detail = await generateDetailPageInAllLocales({
      parentCollection: 'homePage',
      parentId: home,
      tenant,
      title: `guard detail ${time}`,
    });

    const superAdminToken = await loginToken({
      payload,
      type: 'super-admin',
    });

    // default locale -> 400
    const defaultLocaleResult = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'de',
      request,
      token: superAdminToken,
    });

    expect(defaultLocaleResult.status)
      .toBe(400);

    // unknown locale -> 400
    const unknownLocaleResult = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'xx',
      request,
      token: superAdminToken,
    });

    expect(unknownLocaleResult.status)
      .toBe(400);

    // no user -> 401
    const noUserResult = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'fr',
      request,
    });

    expect(noUserResult.status)
      .toBe(401);

    // translator (no delete access) -> 403
    const translatorToken = await loginToken({
      payload,
      type: 'translator',
    });

    const translatorResult = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'fr',
      request,
      token: translatorToken,
    });

    expect(translatorResult.status)
      .toBe(403);

    // home page: endpoint not registered -> 404
    const homeResult = await postDeleteLocale({
      collection: 'homePage',
      id: home,
      locale: 'fr',
      request,
      token: superAdminToken,
    });

    expect(homeResult.status)
      .toBe(404);

    // singletons are out of scope: endpoint not registered -> 404
    const dataPrivacyPages = await payload.find({
      collection: 'dataPrivacyPage',
      depth: 0,
      limit: 1,
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    const dataPrivacyId = dataPrivacyPages.docs[0]?.id ?? (await generateDataPrivacyPage({
      tenant,
    })).id;

    const singletonResult = await postDeleteLocale({
      collection: 'dataPrivacyPage',
      id: dataPrivacyId,
      locale: 'fr',
      request,
      token: superAdminToken,
    });

    expect(singletonResult.status)
      .toBe(404);

    // nothing was deleted by the rejected requests
    const raw = await payload.db.findOne<RawDoc>({
      collection: 'detailPage',
      where: {
        id: {
          equals: detail.id,
        },
      },
    });

    expect((rawLocalized(raw, ['slug']) as Record<string, string>).fr)
      .toBeTruthy();
  });

  test('guards: locale not enabled for the tenant -> 400', async ({
    request,
  }) => {
    await deleteSetsPages();
    await deleteOtherCollections();
    await deleteTenants();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();

    const tenant = await generateTenant({
      addDefaultTenantData: false,
      slug: `tenant-${time}`,
    });

    await payload.update({
      collection: 'tenants',
      data: {
        languages: {
          de: true,
          en: true,
          fr: true,
          it: false,
        },
      },
      id: tenant.id,
    });

    const home = await getHomeId({
      isSagw: false,
      tenant: tenant.id,
    });

    const detail = await generateDetailPageInAllLocales({
      parentCollection: 'homePage',
      parentId: home,
      tenant: tenant.id,
      title: `tenant detail ${time}`,
    });

    const token = await loginToken({
      payload,
      type: 'super-admin',
    });

    const disabledResult = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'it',
      request,
      token,
    });

    expect(disabledResult.status)
      .toBe(400);

    const enabledResult = await postDeleteLocale({
      collection: 'detailPage',
      id: detail.id,
      locale: 'fr',
      request,
      token,
    });

    expect(enabledResult.status)
      .toBe(200);
  });
});
