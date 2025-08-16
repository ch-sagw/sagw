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
      name: 'zenodoDocumentChooser',
      required: true,
      type: 'text',

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
