import type { CollectionConfig } from 'payload';

export const pagePreviewEditComponents: NonNullable<
  NonNullable<CollectionConfig['admin']>['components']
>['edit'] = {
  PreviewButton: '@/components/admin/PreviewButtonWithExtra',
};
