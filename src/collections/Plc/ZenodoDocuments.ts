// todo: save size in mb.
// todo: save date
// todo: in validate, check for duplicate ids
// todo: e.g. this id returns multiple files. how to display it?

import type { CollectionConfig } from 'payload';

export const ZenodoDocuments: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Assets',
  },
  fields: [
    {
      admin: {
        components: {
          Field: {
            path: 'src/components/admin/ZenodoDocumentChooser/ZenodoDocumentChooser',
          },
        },
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          fields: [
            {
              name: 'link',
              type: 'text',
            },
            {
              name: 'format',
              type: 'text',
            },
            {
              name: 'size',
              type: 'number',
            },
          ],
          name: 'files',
          type: 'array',
        },
      ],
      name: 'zenodoDocumentChooser',
      required: true,
      type: 'group',

      // todo: type properly
      validate: (val: any): any => {
        if (!val) {
          return 'You must verify a Zenodo ID before saving';
        }

        return true;
      },
    },
  ],
  slug: 'zenodoDocuments',
};
