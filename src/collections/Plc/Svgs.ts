import type { CollectionConfig } from 'payload';
import { versions } from '@/field-templates/versions';

export const Svgs: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets',
  },
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
    },
  ],
  slug: 'svgs',
  upload: {
    focalPoint: true,
    mimeTypes: ['image/svg+xml'],
  },
  versions,
};
