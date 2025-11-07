import { LinkableCollectionSlug } from '@/collections/Pages/pages';
import { Field } from 'payload';

interface InterfaceFieldInternalLinkChooserProps {
  optional?: boolean;
  name: string;
  linkableCollections?: LinkableCollectionSlug[];
  position?: 'sidebar' | undefined;
  description?: string;
}

export const fieldInternalLinkChooser = (props: InterfaceFieldInternalLinkChooserProps): Field => {
  const field: Field = {
    admin: {
      components: {
        Field: {
          path: '@/components/admin/InternalLinkChooser/InternalLinkChooser',
        },
      },
      description: props.description,
      position: props.position,
    },
    fields: [
      {
        admin: {
          hidden: true,
        },
        name: 'slug',
        required: true,
        type: 'text',
      },
      {
        admin: {
          hidden: true,
        },
        name: 'documentId',
        required: true,
        type: 'text',
      },
    ],
    interfaceName: 'InterfaceInternalLinkValue',
    name: props.name,
    required: !props?.optional,
    type: 'group',
    ...(props?.linkableCollections
      ? {
        linkableCollections: props.linkableCollections,
      }
      : {}),
  };

  return field;
};
