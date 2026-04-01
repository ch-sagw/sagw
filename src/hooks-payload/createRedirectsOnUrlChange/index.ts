import {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionSlug,
  PayloadRequest,
} from 'payload';
import { fieldBreadcrumbFieldName } from '@/field-templates/breadcrumb';
import {
  Config, InterfaceBreadcrumb, Redirect,
} from '@/payload-types';
import { getLocaleCodes } from '@/i18n/payloadConfig';
import { buildUrlFromPath } from '@/utilities/buildUrlFromPath';
import { getBreadcrumbPathSegments } from '@/utilities/getBreadcrumbPathSegments';
import { normalizeRedirectPath } from '@/utilities/normalizeRedirectPath';
import { assertRedirectPairsValid } from '@/hooks-payload/validateRedirectGraph/shared';
import { extractID } from '@/utilities/extractId';
import { findChildPages } from '@/hooks-payload/shared/findChildPages';

type InterfaceRedirectPair = Pick<Redirect, 'from' | 'to'>;

interface InterfacePendingRedirectOperation {
  pairs: InterfaceRedirectPair[];
  tenantId: string;
}

interface InterfacePendingRedirectDeleteOperation {
  tenantId: string;
  urls: string[];
}

const pendingRedirectOperations = new WeakMap<PayloadRequest, Map<string, InterfacePendingRedirectOperation>>();
const pendingRedirectDeleteOperations = new WeakMap<PayloadRequest, Map<string, InterfacePendingRedirectDeleteOperation>>();
const suppressedRedirectOperationKeys = new Set<string>();

const getRequestStore = <T>(
  weakMap: WeakMap<PayloadRequest, Map<string, T>>,
  req: PayloadRequest,
): Map<string, T> => {
  const existingStore = weakMap.get(req);

  if (existingStore) {
    return existingStore;
  }

  const newStore = new Map<string, T>();

  weakMap.set(req, newStore);

  return newStore;
};

const getOperationKey = (
  collectionSlug: string | undefined,
  id: string | undefined,
): string | undefined => (collectionSlug && id
  ? `${collectionSlug}:${id}`
  : undefined);

export const suppressRedirectCreationForOperation = (
  collectionSlug: string | undefined,
  id: string | undefined,
): void => {
  const operationKey = getOperationKey(collectionSlug, id);

  if (operationKey) {
    suppressedRedirectOperationKeys.add(operationKey);
  }
};

export const resumeRedirectCreationForOperation = (
  collectionSlug: string | undefined,
  id: string | undefined,
): void => {
  const operationKey = getOperationKey(collectionSlug, id);

  if (operationKey) {
    suppressedRedirectOperationKeys.delete(operationKey);
  }
};

const setPendingRedirectOperation = (
  req: PayloadRequest,
  key: string | undefined,
  operation?: InterfacePendingRedirectOperation,
): void => {
  if (!key) {
    return;
  }

  const store = getRequestStore(pendingRedirectOperations, req);

  if (!operation || operation.pairs.length === 0) {
    store.delete(key);

    return;
  }

  store.set(key, operation);
};

const consumePendingRedirectOperation = (
  req: PayloadRequest,
  key: string | undefined,
): InterfacePendingRedirectOperation | undefined => {
  if (!key) {
    return undefined;
  }

  const store = getRequestStore(pendingRedirectOperations, req);
  const value = store.get(key);

  store.delete(key);

  return value;
};

const setPendingDeleteOperation = (
  req: PayloadRequest,
  key: string | undefined,
  operation?: InterfacePendingRedirectDeleteOperation,
): void => {
  if (!key) {
    return;
  }

  const store = getRequestStore(pendingRedirectDeleteOperations, req);

  if (!operation || operation.urls.length === 0) {
    store.delete(key);

    return;
  }

  store.set(key, operation);
};

const consumePendingDeleteOperation = (
  req: PayloadRequest,
  key: string | undefined,
): InterfacePendingRedirectDeleteOperation | undefined => {
  if (!key) {
    return undefined;
  }

  const store = getRequestStore(pendingRedirectDeleteOperations, req);
  const value = store.get(key);

  store.delete(key);

  return value;
};

const getNestedOperationArgs = (req: PayloadRequest): {
  overrideAccess?: false;
  req: PayloadRequest;
} => (req.user
  ? {
    overrideAccess: false,
    req,
  }
  : {
    req,
  });

const getTenantId = (value: unknown): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && 'id' in value && value.id) {
    return String(value.id);
  }

  return extractID(value as any);
};

const getLocalizedValue = (
  value: unknown,
  locale: Config['locale'],
): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && locale in value) {
    const localizedValue = value[locale as keyof typeof value];

    return typeof localizedValue === 'string'
      ? localizedValue
      : undefined;
  }

  return undefined;
};

const mergeLocalizedValue = (
  existingValue: unknown,
  nextValue: unknown,
  locale: Config['locale'],
): unknown => {
  if (nextValue === undefined) {
    return existingValue;
  }

  if (typeof nextValue === 'string') {
    const existingRecord = existingValue &&
      typeof existingValue === 'object' &&
      !Array.isArray(existingValue)
      ? existingValue as Record<string, unknown>
      : {};

    return {
      ...existingRecord,
      [locale]: nextValue,
    };
  }

  if (nextValue && typeof nextValue === 'object' && !Array.isArray(nextValue)) {
    const existingRecord = existingValue &&
      typeof existingValue === 'object' &&
      !Array.isArray(existingValue)
      ? existingValue as Record<string, unknown>
      : {};

    return {
      ...existingRecord,
      ...(nextValue as Record<string, unknown>),
    };
  }

  return nextValue;
};

const getTenantSlugByLocale = async (
  payload: PayloadRequest['payload'],
  tenantValue: unknown,
): Promise<Partial<Record<Config['locale'], string | null>>> => {
  const locales = getLocaleCodes();
  const emptyResult = Object.fromEntries(locales.map((locale) => [
    locale,
    null,
  ])) as Partial<Record<Config['locale'], string | null>>;

  if (!tenantValue) {
    return emptyResult;
  }

  const tenantFromValue = (value: unknown): Partial<Record<Config['locale'], string | null>> | undefined => {
    if (!value || typeof value !== 'object' || !('slug' in value)) {
      return undefined;
    }

    const slugValue = value.slug;
    const result: Partial<Record<Config['locale'], string | null>> = {};
    const germanSlug = getLocalizedValue(slugValue, 'de');

    locales.forEach((locale) => {
      result[locale] = getLocalizedValue(slugValue, locale) || germanSlug || null;
    });

    return result;
  };

  const directTenant = tenantFromValue(tenantValue);

  if (directTenant) {
    return directTenant;
  }

  const tenantId = getTenantId(tenantValue);

  if (!tenantId) {
    return emptyResult;
  }

  try {
    const tenantDoc = await payload.findByID({
      collection: 'tenants',
      depth: 0,
      id: tenantId,
      locale: 'all',
    });

    return tenantFromValue(tenantDoc) || emptyResult;
  } catch {
    return emptyResult;
  }
};

const buildPageUrlForLocale = async ({
  locale,
  pageDoc,
  payload,
}: {
  locale: Config['locale'];
  pageDoc: Record<string, any>;
  payload: PayloadRequest['payload'];
}): Promise<string | undefined> => {
  const slug = getLocalizedValue(pageDoc.slug, locale);

  if (!slug) {
    return undefined;
  }

  const tenantSlugByLocale = await getTenantSlugByLocale(payload, pageDoc.tenant);
  const tenantSlug = tenantSlugByLocale[locale] ?? tenantSlugByLocale.de ?? null;
  const breadcrumb = Array.isArray(pageDoc[fieldBreadcrumbFieldName])
    ? pageDoc[fieldBreadcrumbFieldName] as InterfaceBreadcrumb
    : [];

  return normalizeRedirectPath(buildUrlFromPath({
    locale,
    pathSegments: getBreadcrumbPathSegments({
      breadcrumb,
      locale,
    }),
    slug,
    tenant: tenantSlug,
  }));
};

const getPageUrlsByLocale = async (
  payload: PayloadRequest['payload'],
  pageDoc: Record<string, any>,
  locales = getLocaleCodes(),
): Promise<Partial<Record<Config['locale'], string>>> => {
  const urls: Partial<Record<Config['locale'], string>> = {};
  const urlEntries = await Promise.all(locales.map(async (locale) => {
    const url = await buildPageUrlForLocale({
      locale,
      pageDoc,
      payload,
    });

    return [
      locale,
      url,
    ] as const;
  }));

  urlEntries.forEach(([
    locale,
    url,
  ]) => {
    if (url) {
      urls[locale] = url;
    }
  });

  return urls;
};

const buildUpdatedPageDoc = ({
  data,
  locale,
  previousDoc,
}: {
  data: Record<string, any>;
  locale: Config['locale'];
  previousDoc: Record<string, any>;
}): Record<string, any> => {
  const nextStatus = data._status ?? previousDoc._status;
  const updatedPageDoc: Record<string, any> = {
    ...previousDoc,
    ...data,
    [fieldBreadcrumbFieldName]: data[fieldBreadcrumbFieldName] ?? previousDoc[fieldBreadcrumbFieldName],
    slug: mergeLocalizedValue(previousDoc.slug, data.slug, locale),
  };

  updatedPageDoc._status = nextStatus;

  return updatedPageDoc;
};

const collectDescendantPages = async (
  payload: PayloadRequest['payload'],
  req: PayloadRequest,
  rootDocumentId: string,
  tenantId: string,
): Promise<any[]> => {
  const descendants: any[] = [];
  const visited = new Set<string>();

  const visit = async (parentDocumentId: string): Promise<void> => {
    const children = await findChildPages(payload, req, parentDocumentId, tenantId);
    const uniqueChildren = children.filter((child) => {
      const childId = String(child.id || child._id || '');
      const childCollection = String(child._collection || '');
      const childKey = `${childCollection}:${childId}`;

      if (!childId || !childCollection || visited.has(childKey)) {
        return false;
      }

      visited.add(childKey);

      return true;
    });

    descendants.push(...uniqueChildren);

    await Promise.all(uniqueChildren.map(async (child) => {
      const childId = String(child.id || child._id || '');

      await visit(childId);
    }));
  };

  await visit(rootDocumentId);

  return descendants;
};

const replaceUrlPrefix = (
  currentUrl: string,
  oldPrefix: string,
  newPrefix: string,
): string | undefined => {
  const normalizedCurrentUrl = normalizeRedirectPath(currentUrl);
  const normalizedOldPrefix = normalizeRedirectPath(oldPrefix);
  const normalizedNewPrefix = normalizeRedirectPath(newPrefix);

  if (normalizedCurrentUrl === normalizedOldPrefix) {
    return normalizedNewPrefix;
  }

  const oldPrefixWithBoundary = `${normalizedOldPrefix}/`;

  if (!normalizedCurrentUrl.startsWith(oldPrefixWithBoundary)) {
    return undefined;
  }

  return normalizeRedirectPath(`${normalizedNewPrefix}${normalizedCurrentUrl.slice(normalizedOldPrefix.length)}`);
};

const getRedirectEntriesForTenant = async (
  req: PayloadRequest,
  tenantId: string,
): Promise<{
  from: string;
  id?: string;
  to: string;
}[]> => {
  const {
    docs,
  } = await req.payload.find({
    collection: 'redirects',
    depth: 0,
    limit: 0,
    pagination: false,
    select: {
      from: true,
      id: true,
      to: true,
    },
    where: {
      tenant: {
        equals: tenantId,
      },
    },
    ...getNestedOperationArgs(req),
  });

  return docs;
};

const getPublishedStatus = (pageDoc: Record<string, any>): string | null | undefined => pageDoc?._status;

const buildRedirectPairsForUpdate = async ({
  collectionSlug,
  data,
  originalDoc,
  req,
}: {
  collectionSlug: string | undefined;
  data: Record<string, any>;
  originalDoc: Record<string, any>;
  req: PayloadRequest;
}): Promise<InterfacePendingRedirectOperation | undefined> => {
  if (!collectionSlug || !originalDoc?.id) {
    return undefined;
  }

  const previousFullDoc = await req.payload.findByID({
    collection: collectionSlug as CollectionSlug,
    depth: 0,
    id: originalDoc.id,
    locale: 'all',
  });
  const previousFullDocRecord = previousFullDoc as Record<string, any>;

  const locale = (req.locale || 'de') as Config['locale'];
  const nextFullDoc = buildUpdatedPageDoc({
    data,
    locale,
    previousDoc: previousFullDocRecord,
  });

  if (getPublishedStatus(previousFullDocRecord) !== 'published' || getPublishedStatus(nextFullDoc) !== 'published') {
    return undefined;
  }

  const tenantId = getTenantId(nextFullDoc.tenant ?? previousFullDocRecord.tenant);

  if (!tenantId) {
    return undefined;
  }

  const oldUrlsByLocale = await getPageUrlsByLocale(req.payload, previousFullDocRecord);
  const newUrlsByLocale = await getPageUrlsByLocale(req.payload, nextFullDoc);
  const affectedLocales = getLocaleCodes()
    .filter((candidateLocale) => oldUrlsByLocale[candidateLocale] && newUrlsByLocale[candidateLocale] && oldUrlsByLocale[candidateLocale] !== newUrlsByLocale[candidateLocale]);

  if (affectedLocales.length === 0) {
    return undefined;
  }

  const pairs = new Map<string, string>();

  affectedLocales.forEach((affectedLocale) => {
    const from = oldUrlsByLocale[affectedLocale];
    const to = newUrlsByLocale[affectedLocale];

    if (from && to && from !== to) {
      pairs.set(from, to);
    }
  });

  const descendants = await collectDescendantPages(req.payload, req, String(previousFullDoc.id), tenantId);
  const publishedDescendants = descendants.filter((descendant) => getPublishedStatus(descendant) === 'published');
  const descendantUrlEntries = await Promise.all(publishedDescendants.map(async (descendant) => ({
    descendant,
    urls: await getPageUrlsByLocale(req.payload, descendant, affectedLocales),
  })));

  descendantUrlEntries.forEach(({
    urls: descendantUrls,
  }) => {
    affectedLocales.forEach((affectedLocale) => {
      const descendantFrom = descendantUrls[affectedLocale];
      const oldParentUrl = oldUrlsByLocale[affectedLocale];
      const newParentUrl = newUrlsByLocale[affectedLocale];

      if (descendantFrom && oldParentUrl && newParentUrl) {
        const descendantTo = replaceUrlPrefix(descendantFrom, oldParentUrl, newParentUrl);

        if (descendantTo && descendantFrom !== descendantTo) {
          pairs.set(descendantFrom, descendantTo);
        }
      }
    });
  });

  const pendingPairs = Array.from(pairs.entries())
    .map(([
      from,
      to,
    ]) => ({
      from,
      to,
    })) as InterfaceRedirectPair[];

  if (pendingPairs.length === 0) {
    return undefined;
  }

  const existingEntries = await getRedirectEntriesForTenant(req, tenantId);

  assertRedirectPairsValid({
    existingEntries,
    pendingEntries: pendingPairs,
  });

  return {
    pairs: pendingPairs,
    tenantId,
  };
};

const buildDeleteOperation = async ({
  collectionSlug,
  id,
  req,
}: {
  collectionSlug: string | undefined;
  id: string | undefined;
  req: PayloadRequest;
}): Promise<InterfacePendingRedirectDeleteOperation | undefined> => {
  if (!collectionSlug || !id) {
    return undefined;
  }

  const pageDoc = await req.payload.findByID({
    collection: collectionSlug as CollectionSlug,
    depth: 0,
    id,
    locale: 'all',
  });
  const pageDocRecord = pageDoc as Record<string, any>;

  const tenantId = getTenantId(pageDocRecord.tenant);

  if (!tenantId) {
    return undefined;
  }

  const urlSet = new Set<string>(Object.values(await getPageUrlsByLocale(req.payload, pageDocRecord))
    .filter((url): url is string => Boolean(url)));
  const descendants = await collectDescendantPages(req.payload, req, String(id), tenantId);
  const publishedDescendants = descendants.filter((descendant) => getPublishedStatus(descendant) === 'published');
  const descendantUrlEntries = await Promise.all(publishedDescendants.map(async (descendant) => Object.values(await getPageUrlsByLocale(req.payload, descendant))
    .filter((url): url is string => Boolean(url))));

  descendantUrlEntries.forEach((descendantUrls) => {
    descendantUrls.forEach((url) => {
      urlSet.add(url);
    });
  });

  const urls = Array.from(urlSet);

  if (urls.length === 0) {
    return undefined;
  }

  return {
    tenantId,
    urls,
  };
};

export const hookValidateRedirectsOnUrlChange: CollectionBeforeChangeHook = async ({
  collection,
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (!data || !req?.payload || operation !== 'update' || !originalDoc) {
    return data;
  }

  if (context?.cascadeBreadcrumbUpdate) {
    return data;
  }

  const operationKey = getOperationKey(collection?.slug, String(originalDoc.id || ''));
  const pendingOperation = await buildRedirectPairsForUpdate({
    collectionSlug: collection?.slug,
    data,
    originalDoc,
    req,
  });

  setPendingRedirectOperation(req, operationKey, pendingOperation);

  return data;
};

export const hookCreateRedirectsOnUrlChange: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  req,
}) => {
  const operationKey = getOperationKey(collection?.slug, String(doc?.id || ''));

  if (!doc || !req?.payload || operation !== 'update') {
    return doc;
  }

  if (operationKey && suppressedRedirectOperationKeys.has(operationKey)) {
    return doc;
  }

  const pendingOperation = consumePendingRedirectOperation(req, operationKey);

  if (!pendingOperation) {
    return doc;
  }

  await Promise.all(pendingOperation.pairs.map(async (pair) => {
    await req.payload.create({
      collection: 'redirects',
      data: {
        from: pair.from,
        tenant: pendingOperation.tenantId,
        to: pair.to,
      },
      ...getNestedOperationArgs(req),
    });
  }));

  return doc;
};

export const hookStoreRedirectsForPageDelete: CollectionBeforeDeleteHook = async ({
  collection,
  context,
  id,
  req,
}) => {
  if (!req?.payload || context?.cascadeBreadcrumbUpdate) {
    return;
  }

  const documentId = id?.toString();
  const operationKey = getOperationKey(collection?.slug, documentId);
  const pendingDeleteOperation = await buildDeleteOperation({
    collectionSlug: collection?.slug,
    id: documentId,
    req,
  });

  setPendingDeleteOperation(req, operationKey, pendingDeleteOperation);
};

export const hookDeleteRedirectsOnUrlChange: CollectionAfterDeleteHook = async ({
  collection,
  doc,
  id,
  req,
}) => {
  if (!req?.payload) {
    return;
  }

  const documentId = id?.toString() || doc?.id?.toString();
  const operationKey = getOperationKey(collection?.slug, documentId);
  const pendingDeleteOperation = consumePendingDeleteOperation(req, operationKey);

  if (!pendingDeleteOperation) {
    return;
  }

  const {
    docs,
  } = await req.payload.find({
    collection: 'redirects',
    depth: 0,
    limit: 0,
    pagination: false,
    where: {
      and: [
        {
          tenant: {
            equals: pendingDeleteOperation.tenantId,
          },
        },
        {
          to: {
            in: pendingDeleteOperation.urls,
          },
        },
      ],
    },
    ...getNestedOperationArgs(req),
  });

  await Promise.all(docs.map(async (redirectDoc) => {
    await req.payload.delete({
      collection: 'redirects',
      id: redirectDoc.id,
      ...getNestedOperationArgs(req),
    });
  }));
};
