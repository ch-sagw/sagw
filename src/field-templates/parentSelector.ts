import { Field } from 'payload';

interface InterfaceParentSelectorProps {
  parentCollections?: string[];
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
