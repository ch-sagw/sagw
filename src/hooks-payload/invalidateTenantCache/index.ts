import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionSlug,
  PayloadRequest,
} from 'payload';
import { extractID } from '@/utilities/extractId';
import type { Tenant } from '@/payload-types';
import {
  getTenantRoutePathsByTenantId, invalidateCache,
} from '@/utilities/invalidateCache';

// `invalidateCache` enumerates the tenant's paths from the current database
// state. A path that disappears with the mutation (deleted page, renamed
// slug) is not enumerable anymore once the mutation is done, so the
// before-hooks collect the paths first and stash them on `req.context`;
// the after-hooks pass them on as `additionalPaths`.
//
// NOTE: always go through `req.context`, never through the `context` hook
// argument. Nested local API calls that receive `req` replace `req.context`
// with a copy (createLocalReq), which detaches the hook argument.
const contextKey = 'tenantRoutePathsBeforeMutation';

const stashPaths = ({
  paths,
  req,
}: {
  paths: string[];
  req: PayloadRequest;
}): void => {
  const existing = Array.isArray(req.context[contextKey])
    ? req.context[contextKey] as string[]
    : [];

  req.context[contextKey] = [
    ...existing,
    ...paths,
  ];
};

const takePaths = (req: PayloadRequest): string[] => {
  const paths = Array.isArray(req.context[contextKey])
    ? req.context[contextKey] as string[]
    : [];

  delete req.context[contextKey];

  return paths;
};

export const hookCaptureTenantRoutePathsBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  // a create cannot make an existing url disappear; draft saves (incl.
  // autosave) do not touch the published urls.
  if (operation !== 'update' || data?._status === 'draft') {
    return data;
  }

  const tenantId = originalDoc?.tenant
    ? extractID(originalDoc.tenant)
    : null;

  stashPaths({
    paths: await getTenantRoutePathsByTenantId({
      payload: req.payload,
      tenantId,
    }),
    req,
  });

  return data;
};

export const hookCaptureTenantRoutePathsBeforeDelete: CollectionBeforeDeleteHook = async ({
  collection,
  id,
  req,
}) => {
  const doc = await req.payload.findByID({
    collection: collection.slug as CollectionSlug,
    depth: 0,
    disableErrors: true,
    id,
    overrideAccess: true,
    req,
  }) as { tenant?: Tenant | string | null } | null;

  const tenantId = doc?.tenant
    ? extractID(doc.tenant)
    : null;

  stashPaths({
    paths: await getTenantRoutePathsByTenantId({
      payload: req.payload,
      tenantId,
    }),
    req,
  });
};

export const hookInvalidateTenantCache: CollectionAfterChangeHook = async ({
  context,
  doc,
  req,
  previousDoc,
}) => {
  const currentStatus = doc && '_status' in doc
    ? doc._status
    : undefined;
  const previousStatus = previousDoc && '_status' in previousDoc
    ? previousDoc._status
    : undefined;
  const hasDraftStatus = currentStatus !== undefined || previousStatus !== undefined;
  const isPublished = currentStatus === 'published';
  const justUnpublished = previousStatus === 'published' && currentStatus !== 'published';

  // Draft/versioned collections: only on publish or unpublish.
  // No drafts collections: every save.
  const shouldInvalidate =
    !hasDraftStatus ||
    isPublished ||
    justUnpublished;

  const additionalPaths = takePaths(req);

  if (shouldInvalidate) {
    await invalidateCache({
      additionalPaths,
      includeDrafts: justUnpublished,
      logCacheInvalidation: context.logCacheInvalidation === true,
      payload: req.payload,
      tenantId: doc?.tenant
        ? extractID(doc.tenant)
        : null,
    });
  }

  return doc;
};

export const hookInvalidateTenantCacheOnDelete: CollectionAfterDeleteHook = async ({
  context,
  doc,
  req,
}) => {
  await invalidateCache({
    additionalPaths: takePaths(req),
    logCacheInvalidation: context.logCacheInvalidation === true,
    payload: req.payload,
    tenantId: doc?.tenant
      ? extractID(doc.tenant)
      : null,
  });
};
