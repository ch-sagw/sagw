import type {
  CollectionConfig, CollectionSlug,
} from 'payload';
import { deleteLocaleVariantCollectionSlugs } from '@/hooks-payload/deleteLocaleVariant/constants';
import { deleteLocaleEndpoint } from '@/hooks-payload/deleteLocaleVariant/endpoint';

export const deleteLocaleMenuItemComponentPath = '@/components/admin/DeleteLocaleMenuItem';

// Adds the "delete language variant" feature to a page collection:
// - `POST /:id/delete-locale` collection endpoint
// - "Löschen (Sprachvariante)" entry in the edit view 3-dot menu
const withDeleteLocaleVariant = (collection: CollectionConfig): CollectionConfig => {
  const existingEndpoints = collection.endpoints === false
    ? []
    : (collection.endpoints ?? []);
  const existingEditMenuItems = collection.admin?.components?.edit?.editMenuItems ?? [];

  return {
    ...collection,
    admin: {
      ...collection.admin,
      components: {
        ...collection.admin?.components,
        edit: {
          ...collection.admin?.components?.edit,
          editMenuItems: [
            ...existingEditMenuItems,
            deleteLocaleMenuItemComponentPath,
          ],
        },
      },
    },
    endpoints: [
      ...existingEndpoints,
      deleteLocaleEndpoint,
    ],
  };
};

// Applies `withDeleteLocaleVariant` to the eligible page collections only;
// all other collections are returned unchanged.
export const applyDeleteLocaleVariant = (collections: CollectionConfig[]): CollectionConfig[] => collections.map((collection) => {
  const isEligible = deleteLocaleVariantCollectionSlugs.includes(collection.slug as CollectionSlug);

  return isEligible
    ? withDeleteLocaleVariant(collection)
    : collection;
});
