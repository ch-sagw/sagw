import type {
  Collection, Payload,
} from 'payload';
import type {
  InterfaceReferenceIndex, InterfaceScanResult,
} from '@/jobs/assetsCleanup/types';
import {
  collectGenericReferences, createReferenceIndex, isRecord,
} from '@/jobs/assetsCleanup/collectGeneric';
import { collectSchemaReferences } from '@/jobs/assetsCleanup/collectSchema';
import { excludedScanCollections } from '@/jobs/assetsCleanup/config';

// ########################################################################
// Scanner
//
// Reads every document of every collection (except the excluded ones) and
// every version document directly from MongoDB (raw, all locales, no
// hooks, no access control) and feeds them into both collectors.
// ########################################################################

const batchSize = 200;

interface InterfaceScanArgs {
  payload: Payload;

  // when set, only documents updated at or after this date are scanned.
  // used for the re-scan after the main scan (race protection).
  since?: Date;
}

// Mongoose lean documents contain ObjectId and Date instances. Serializing
// them once gives us plain JSON with hex strings and ISO dates.
const toPlainJson = (raw: unknown): unknown => JSON.parse(JSON.stringify(raw));

const getLocaleCodes = (payload: Payload): string[] => {
  const {
    localization,
  } = payload.config;

  if (!localization) {
    return [];
  }

  return localization.localeCodes;
};

const getScanCollectionSlugs = (payload: Payload): string[] => Object.keys(payload.db.collections)
  .filter((slug) => !excludedScanCollections.includes(slug));

const getScanVersionSlugs = (payload: Payload): string[] => Object.keys(payload.db.versions)
  .filter((slug) => !excludedScanCollections.includes(slug));

const buildFilter = (since?: Date): Record<string, unknown> => {
  if (!since) {
    return {};
  }

  return {
    updatedAt: {
      $gte: since,
    },
  };
};

const scanModel = async ({
  filter,
  index,
  isVersion,
  localeCodes,
  payload,
  schemaIds,
  slug,
}: {
  filter: Record<string, unknown>;
  index: InterfaceReferenceIndex;
  isVersion: boolean;
  localeCodes: string[];
  payload: Payload;
  schemaIds: Set<string>;
  slug: string;
}): Promise<number> => {
  const model = isVersion
    ? payload.db.versions[slug]
    : payload.db.collections[slug];
  const collections = payload.collections as Record<string, Collection | undefined>;
  const fields = collections[slug]?.config.fields || [];
  const cursor = model
    .find(filter)
    .lean()
    .cursor({
      batchSize,
    });
  let count = 0;

  for await (const raw of cursor) {
    const doc = toPlainJson(raw);

    collectGenericReferences(doc, index);

    // version docs wrap the actual document in `version`
    const schemaData = isVersion && isRecord(doc)
      ? doc.version
      : doc;

    collectSchemaReferences({
      data: schemaData,
      fields,
      ids: schemaIds,
      localeCodes,
      payload,
    });

    count += 1;
  }

  return count;
};

export const scanReferences = async ({
  payload,
  since,
}: InterfaceScanArgs): Promise<InterfaceScanResult> => {
  const scanStart = new Date();
  const index = createReferenceIndex();
  const schemaIds = new Set<string>();
  const errors: string[] = [];
  const localeCodes = getLocaleCodes(payload);
  const filter = buildFilter(since);
  const collectionSlugs = getScanCollectionSlugs(payload);
  const versionSlugs = getScanVersionSlugs(payload);
  let docs = 0;
  let versions = 0;

  for await (const slug of collectionSlugs) {
    try {
      docs += await scanModel({
        filter,
        index,
        isVersion: false,
        localeCodes,
        payload,
        schemaIds,
        slug,
      });
    } catch (error) {
      errors.push(`Scanning collection "${slug}" failed: ${error instanceof Error
        ? error.message
        : String(error)}`);
    }
  }

  for await (const slug of versionSlugs) {
    try {
      versions += await scanModel({
        filter,
        index,
        isVersion: true,
        localeCodes,
        payload,
        schemaIds,
        slug,
      });
    } catch (error) {
      errors.push(`Scanning versions of "${slug}" failed: ${error instanceof Error
        ? error.message
        : String(error)}`);
    }
  }

  return {
    errors,
    index,
    scanStart,
    schemaIds,
    stats: {
      collections: collectionSlugs,
      docs,
      versionCollections: versionSlugs,
      versions,
    },
  };
};

// merges the result of a re-scan into the main scan result
export const mergeScanResults = (target: InterfaceScanResult, source: InterfaceScanResult): void => {
  source.index.ids.forEach((id) => target.index.ids.add(id));
  source.index.filenames.forEach((filename) => target.index.filenames.add(filename));
  source.index.urlCorpus.forEach((entry) => target.index.urlCorpus.add(entry));
  source.index.autoProjects.forEach((project) => target.index.autoProjects.add(project));
  source.schemaIds.forEach((id) => target.schemaIds.add(id));
  source.errors.forEach((error) => target.errors.push(error));
  target.stats.docs += source.stats.docs;
  target.stats.versions += source.stats.versions;
};

// every id found by the schema-aware collector must also have been found
// by the generic collector. returns the ids which violate this rule.
export const findInvariantViolations = (scan: InterfaceScanResult): string[] => [...scan.schemaIds].filter((id) => !scan.index.ids.has(id));
