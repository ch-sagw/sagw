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
      type: 'json',
      validate: (val: any) => (val
        ? true
        : 'You must verify a Zenodo ID before saving'),
    },
  ],
  slug: 'zenodoDocuments',
};
