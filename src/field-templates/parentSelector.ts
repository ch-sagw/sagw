import { Field } from 'payload';
import type { LinkableCollectionSlug } from '@/collections/Pages/pages';

interface InterfaceParentSelectorProps {
  parentCollections?: LinkableCollectionSlug[];
}

export const fieldParentSelector = (props?: InterfaceParentSelectorProps): Field => {
  const parentSelector: Field = {
    admin: {
      components: {
        Field: {
          path: '@/components/admin/InternalLinkChooser/InternalLinkChooser',
        },
      },
    },
    name: 'parentPage',
    type: 'text',
    ...(props?.parentCollections
      ? {
        linkableCollections: props.parentCollections,
      }
      : {}),
  } as unknown as Field;

  return parentSelector;
};
