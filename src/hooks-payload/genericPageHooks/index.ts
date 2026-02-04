import { hookValidateParentCircularReference } from '@/hooks-payload/validateParentCircularReference';
import { hookGenerateBreadcrumbs } from '@/hooks-payload/generateBreadcrumbs';
import {
  hookCascadeBreadcrumbUpdates, hookCascadeBreadcrumbUpdatesOnDelete,
} from '@/hooks-payload/cascadeBreadcrumbUpdates';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { hookSlug } from '@/hooks-payload/slug';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import {
  CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionBeforeDeleteHook, CollectionBeforeValidateHook,
} from 'payload';
import { hookPreventBlockStructureChangesForTranslators } from '@/hooks-payload/preventBlockStructureChangesForTranslators';
import { hookPreventBulkPublishForTranslators } from '@/hooks-payload/preventBulkPublishForTranslators';
import {
  hookInvalidateCacheOnPageChange, hookInvalidateCacheOnPageDelete,
} from '@/hooks-payload/invalidateCacheOnPageChange';

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
    hookCascadeBreadcrumbUpdates,
    hookInvalidateCacheOnPageChange,
    ...(additionalHooks?.afterChange ?? []),
  ],

  // 4.
  afterDelete: [
    hookCascadeBreadcrumbUpdatesOnDelete,
    ...(additionalHooks?.afterDelete ?? []),
  ],

  // 2.
  beforeChange: [
    hookPreventBulkPublishForTranslators,
    hookSeoFallback,
    hookGenerateBreadcrumbs,
    ...(additionalHooks?.beforeChange ?? []),
  ],

  // 5.
  beforeDelete: [
    hookInvalidateCacheOnPageDelete,
    ...(additionalHooks?.beforeDelete ?? []),
  ],

  // 1.
  beforeValidate: [
    hookAdminTitle,
    hookSlug,
    hookValidateParentCircularReference,
    ...(additionalHooks?.beforeValidate ?? []),
    hookPreventBlockStructureChangesForTranslators(),
  ],
});
