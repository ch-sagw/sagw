import { IncomingCollectionVersions } from 'node_modules/payload/dist/versions/types';

export const versions: IncomingCollectionVersions = {
  drafts: {
    autosave: true,
    schedulePublish: false,
    validate: false,
  },
  maxPerDoc: 50,
};
