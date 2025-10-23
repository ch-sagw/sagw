import { IndexEntry } from 'storybook/internal/types';
import { filterVisualStories } from '@/automated-testing/helpers';
import { vrtConfig } from '@/automated-testing/config';
import {
  readdir, stat,
} from 'fs/promises';
import { join } from 'path';

/**
 * Find orpahaned screenshot folders for FE tests. This means: go through
 * all visualStories, and list all snapshot folder that are not present in
 * visualStories.
 *
 * Start it with: `npm run orphaned:screenshots`
 *
 * ATTENTION: you must have storybook running for this to work.
 */

const manifestResponse = await fetch(`${vrtConfig.baseUrl}/index.json`);
const manifest = await manifestResponse.json();

const visualStories: IndexEntry[] = filterVisualStories(Object.values(manifest.entries) as IndexEntry[]);
const storiesIds = visualStories.map((item) => item.id);

const snapshotFolder = `./src/automated-testing/${vrtConfig.snapshotFolder}`;

const getOrphanedScreenshots = async (): Promise<void> => {
  try {
    const snapshotItems = await readdir(snapshotFolder);
    const snapshotFolders: string[] = [];

    for await (const item of snapshotItems) {
      const itemPath = join(snapshotFolder, item);
      const stats = await stat(itemPath);

      if (stats.isDirectory()) {
        snapshotFolders.push(item);
      }
    }

    const orphanedFolders = snapshotFolders.filter((folder) => !storiesIds.includes(folder));

    console.log(orphanedFolders);
  } catch (error) {
    console.error('Error reading snapshot folder:', error);
  }
};

await getOrphanedScreenshots();
