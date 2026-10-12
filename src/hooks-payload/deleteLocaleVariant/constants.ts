import type { CollectionSlug } from 'payload';
import { setsSlugs } from '@/collections/Pages/constants';

// Page collections that offer "delete language variant" in the edit view
// 3-dot menu: all set pages. Singletons (home, error, data privacy,
// impressum) are intentionally excluded: their slug is not stored in the
// document, so a language variant cannot be made unreachable by removing
// its content.
export const deleteLocaleVariantCollectionSlugs: CollectionSlug[] = setsSlugs.map((setsSlug) => setsSlug.slug);

// Collection endpoint path (relative to `/api/<collection>`)
export const deleteLocaleEndpointPath = '/:id/delete-locale';
