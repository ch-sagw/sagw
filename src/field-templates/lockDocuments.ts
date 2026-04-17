import type { CollectionConfig } from 'payload';

export const lockDocuments: NonNullable<CollectionConfig['lockDocuments']> = {
  duration: 120,
};
