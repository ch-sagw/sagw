import { fieldInternalLinkChooser } from '@/components/admin/InternalLinkChooser/InternalLinkChooserField';
import { Field } from 'payload';

export const fieldParentSelectorFieldName = 'parentPage';

export const fieldParentSelectorDetailPage: Field = fieldInternalLinkChooser({
  linkableCollections: [
    'detailPage',
    'overviewPage',
    'homePage',
  ],
  name: fieldParentSelectorFieldName,
});
