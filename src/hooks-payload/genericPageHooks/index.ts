import { hookValidateParentCircularReference } from '@/hooks-payload/validateParentCircularReference';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import {
  CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionBeforeDeleteHook, CollectionBeforeValidateHook,
} from 'payload';
import { hookPreventBlockStructureChangesForTranslators } from '@/hooks-payload/preventBlockStructureChangesForTranslators';
import { hookPreventBulkPublishForTranslators } from '@/hooks-payload/preventBulkPublishForTranslators';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';

interface InterfaceGenericPageHooks {
  afterChange?: CollectionAfterChangeHook[];
  afterDelete?: CollectionAfterDeleteHook[];
  beforeChange?: CollectionBeforeChangeHook[];
  beforeDelete?: CollectionBeforeDeleteHook[];
  beforeValidate?: CollectionBeforeValidateHook[];
}

export const genericPageHooks = (additionalHooks?: InterfaceGenericPageHooks): InterfaceGenericPageHooks => ({
  // 3.
  afterChange: [
    hookInvalidateTenantCache,
    ...(additionalHooks?.afterChange ?? []),
  ],

  // 4.
  afterDelete: [
    hookInvalidateTenantCacheOnDelete,
    ...(additionalHooks?.afterDelete ?? []),
  ],

  // 2.
  beforeChange: [
    hookPreventBulkPublishForTranslators,
    ...(additionalHooks?.beforeChange ?? []),
  ],

  // 5.
  beforeDelete: [...(additionalHooks?.beforeDelete ?? [])],

  // 1.
  beforeValidate: [
    hookAdminTitle,
    hookValidateParentCircularReference,
    ...(additionalHooks?.beforeValidate ?? []),
    hookPreventBlockStructureChangesForTranslators(),
  ],
});
