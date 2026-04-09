import type {
  CollectionAfterChangeHook, CollectionAfterDeleteHook,
} from 'payload';
import { extractID } from '@/utilities/extractId';
import { invalidateCache } from '@/utilities/invalidateCache';

export const hookInvalidateTenantCache: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  await invalidateCache({
    payload: req.payload,
    tenantId: doc?.tenant
      ? extractID(doc.tenant)
      : null,
  });

  return doc;
};

export const hookInvalidateTenantCacheOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  await invalidateCache({
    payload: req.payload,
    tenantId: doc?.tenant
      ? extractID(doc.tenant)
      : null,
  });
};
