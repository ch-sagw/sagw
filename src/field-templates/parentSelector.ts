import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';
import { Field } from 'payload';

export const fieldParentSelectorFieldName = 'parentPage';

export const fieldParentSelectorDetailPage: Field = fieldInternalLinkChooser({
  description: 'The parent page that this page blongs to. Neccessary for the breadcrumb.',
  linkableCollections: [
    'detailPage',
    'overviewPage',
    'homePage',
  ],
  name: fieldParentSelectorFieldName,
  optional: true,
  position: 'sidebar',
});
