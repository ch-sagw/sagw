import { IncomingCollectionVersions } from 'node_modules/payload/dist/versions/types';

export const versions: IncomingCollectionVersions = {
  drafts: {
    autosave: {
      interval: 1000,
    },
    schedulePublish: false,
  },
  maxPerDoc: 50,
};
