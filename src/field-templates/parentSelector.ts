import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';
import {
  CollectionSlug, Field,
} from 'payload';

export const fieldParentSelectorFieldName = 'parentPage';

export const fieldParentSelector = (linkableCollections: CollectionSlug[] | undefined): Field => fieldInternalLinkChooser({
  description: 'The parent page that this page blongs to. Neccessary for the breadcrumb.',
  linkableCollections,
  name: fieldParentSelectorFieldName,
  optional: false,
  position: 'sidebar',
});

export const fieldParentSelectorDetailPage: Field = fieldParentSelector([
  'detailPage',
  'eventDetailPage',
  'instituteDetailPage',
  'magazineDetailPage',
  'nationalDictionaryDetailPage',
  'newsDetailPage',
  'overviewPage',
  'homePage',
  'projectDetailPage',
  'publicationDetailPage',
]);

export const fieldParentSelectorOverviewPage: Field = fieldParentSelector([
  'overviewPage',
  'homePage',
]);
