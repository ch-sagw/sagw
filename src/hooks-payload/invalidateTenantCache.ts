import type {
  CollectionAfterChangeHook, CollectionAfterDeleteHook,
} from 'payload';
import { invalidateCache } from '@/utilities/invalidateCache';

const getTenantId = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'string') {
    return value.id;
  }

  return null;
};

export const hookInvalidateTenantCache: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  await invalidateCache({
    payload: req.payload,
    tenantId: getTenantId(doc?.tenant),
  });

  return doc;
};

export const hookInvalidateTenantCacheOnDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  await invalidateCache({
    payload: req.payload,
    tenantId: getTenantId(doc?.tenant),
  });
};
