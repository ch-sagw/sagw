import { fieldsSocialLink } from '@/field-templates/socialLink';
import { CollectionConfig } from 'payload';

export const Footer: CollectionConfig = {
  access: {
    read: (): boolean => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      label: 'Datenschutz',
      localized: true,
      name: 'legal',
      required: true,
      type: 'text',
    },
    {
      label: 'Impressum',
      localized: true,
      name: 'impressum',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'copyright',
      required: true,
      type: 'text',
    },
    {
      fields: [
        {
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          name: 'address1',
          required: true,
          type: 'text',
        },
        {
          name: 'address2',
          required: true,
          type: 'text',
        },
        {
          name: 'poBox',
          required: true,
          type: 'text',
        },
        {
          name: 'countryCode',
          required: true,
          type: 'text',
        },
        {
          name: 'zipCode',
          required: true,
          type: 'text',
        },
        {
          localized: true,
          name: 'city',
          required: true,
          type: 'text',
        },
        {
          name: 'phone',
          required: true,
          type: 'text',
        },
        {
          name: 'mail',
          required: true,
          type: 'email',
        },
      ],
      label: 'Kontakt',
      name: 'contact',
      type: 'group',
    },
    {
      fields: fieldsSocialLink,
      name: 'socialLinks',
      required: true,
      type: 'array',
    },
  ],
  slug: 'footer',
};
