import type { CollectionConfig } from 'payload';

// TODO:
// - discuss: subtitles

export const Videos: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Global Content',
  },
  fields: [
    {
      localized: true,
      name: 'alt',
      required: false,
      type: 'text',
    },
  ],
  slug: 'videos',
  upload: true,
};
