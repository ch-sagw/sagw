// TODO:
// - make sure, no duplicate entries (same zenodo id) can be saved
// - in zenodo overview, display title, id & publication date instead of data
// - in zenodo document, display title, id & publication date instead of data
// - improve: if not validated, disable save

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
      name: 'data',
      required: true,
      type: 'json',
    },
  ],
  slug: 'zenodoDocuments',
};
