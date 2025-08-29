import { IncomingCollectionVersions } from 'node_modules/payload/dist/versions/types';

export const versions: IncomingCollectionVersions = {
  drafts: {
    autosave: {
      interval: 100,
    },
    schedulePublish: true,
  },
  maxPerDoc: 50,
};
