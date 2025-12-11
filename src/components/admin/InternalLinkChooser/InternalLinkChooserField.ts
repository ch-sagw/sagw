import { LinkableCollectionSlug } from '@/collections/Pages/pages';
import { Field } from 'payload';

export const INTERNAL_LINK_MARKER_VALUE = '__internalLink__';

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
          readOnly: true,
        },
        defaultValue: INTERNAL_LINK_MARKER_VALUE,
        name: '_internalLinkMarker',
        type: 'text',
      },
      {
        admin: {
          hidden: true,
        },
        name: 'slug',
        required: !props?.optional,
        type: 'text',
      },
      {
        admin: {
          hidden: true,
        },
        name: 'documentId',
        required: !props?.optional,
        type: 'text',
      },
      {
        admin: {
          hidden: true,
        },
        fields: [
          {
            name: 'de',
            type: 'text',
          },
          {
            name: 'fr',
            type: 'text',
          },
          {
            name: 'it',
            type: 'text',
          },
          {
            name: 'en',
            type: 'text',
          },
        ],
        interfaceName: 'InterfaceInternalLinkUrls',
        name: 'url',
        type: 'group',
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
