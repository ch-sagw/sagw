import type {
  CollectionAfterChangeHook, CollectionAfterDeleteHook,
} from 'payload';
import { extractID } from '@/utilities/extractId';
import { invalidateCache } from '@/utilities/invalidateCache';

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

  // Draft/autosave writes should not invalidate. Only invalidate once the
  // document is actually in its published state.
  if (hasDraftStatus && currentStatus !== 'published') {
    return doc;
  }

  await invalidateCache({
    logCacheInvalidation: context.logCacheInvalidation === true,
    payload: req.payload,
    tenantId: doc?.tenant
      ? extractID(doc.tenant)
      : null,
  });

  return doc;
};

export const hookInvalidateTenantCacheOnDelete: CollectionAfterDeleteHook = async ({
  context,
  doc,
  req,
}) => {
  await invalidateCache({
    logCacheInvalidation: context.logCacheInvalidation === true,
    payload: req.payload,
    tenantId: doc?.tenant
      ? extractID(doc.tenant)
      : null,
  });
};
