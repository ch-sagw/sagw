import { hookValidateParentCircularReference } from '@/hooks-payload/validateParentCircularReference';
import { hookGenerateBreadcrumbs } from '@/hooks-payload/generateBreadcrumbs';
import {
  hookCascadeBreadcrumbUpdates, hookCascadeBreadcrumbUpdatesOnDelete,
} from '@/hooks-payload/cascadeBreadcrumbUpdates';
import { hookSeoFallback } from '@/hooks-payload/seoFallback';
import { hookSlug } from '@/hooks-payload/slug';
import { hookAdminTitle } from '@/hooks-payload/adminTitle';
import {
  CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionBeforeValidateHook,
} from 'payload';
import { hookPreventBlockStructureChangesForTranslators } from '@/hooks-payload/preventBlockStructureChangesForTranslators';
import { hookPreventBulkPublishForTranslators } from '@/hooks-payload/preventBulkPublishForTranslators';

interface InterfaceGenericPageHooks {
  afterChange?: CollectionAfterChangeHook[];
  afterDelete?: CollectionAfterDeleteHook[];
  beforeChange?: CollectionBeforeChangeHook[];
  beforeValidate?: CollectionBeforeValidateHook[];
}

export const genericPageHooks = (additionalHooks?: InterfaceGenericPageHooks): InterfaceGenericPageHooks => ({
  // 3.
  afterChange: [
    hookCascadeBreadcrumbUpdates,
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

  // 1.
  beforeValidate: [
    hookAdminTitle,
    hookSlug,
    hookValidateParentCircularReference,
    ...(additionalHooks?.beforeValidate ?? []),
    hookPreventBlockStructureChangesForTranslators(),
  ],
});
