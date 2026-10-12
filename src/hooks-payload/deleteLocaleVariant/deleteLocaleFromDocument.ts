import type {
  CollectionSlug, PayloadRequest, SanitizedCollectionConfig, TypeWithID, TypeWithVersion,
} from 'payload';
import { stripLocale } from '@/hooks-payload/deleteLocaleVariant/stripLocale';

type RawDocument = Record<string, unknown> & TypeWithID;

interface InterfaceDeleteLocaleFromDocumentParams {
  collectionConfig: SanitizedCollectionConfig;
  id: number | string;
  locale: string;

  // Pass the request so all writes share the request's transaction.
  req: PayloadRequest;
}

export interface InterfaceDeleteLocaleFromDocumentResult {
  doc: RawDocument;
  versionsUpdated: number;
}

// Permanently removes all content stored for `locale` from the main
// document AND from every stored version of that document. Writes go
// directly through the database adapter (no collection hooks, no
// validation), so callers are responsible for access checks and cache
// invalidation.
export const deleteLocaleFromDocument = async ({
  collectionConfig,
  id,
  locale,
  req,
}: InterfaceDeleteLocaleFromDocumentParams): Promise<InterfaceDeleteLocaleFromDocumentResult> => {
  const {
    payload,
  } = req;
  const collection = collectionConfig.slug as CollectionSlug;
  const configBlocks = payload.config.blocks ?? [];

  // ------------------------------------------------------------------
  // Main document (raw, all locales)
  // ------------------------------------------------------------------
  const rawDoc = await payload.db.findOne<RawDocument>({
    collection,
    req,
    where: {
      id: {
        equals: id,
      },
    },
  });

  if (!rawDoc) {
    throw new Error(`Document ${String(id)} not found in collection ${collection}`);
  }

  const strippedDoc = stripLocale({
    configBlocks,
    data: rawDoc,
    fields: collectionConfig.fields,
    locale,
  }) as RawDocument;

  strippedDoc.updatedAt = new Date()
    .toISOString();

  const updatedDoc = await payload.db.updateOne({
    collection,
    data: strippedDoc,
    id,
    req,
  });

  // ------------------------------------------------------------------
  // Versions
  // ------------------------------------------------------------------
  let versionsUpdated = 0;

  if (collectionConfig.versions) {
    const versions = await payload.db.findVersions<Record<string, unknown>>({
      collection,
      limit: 0,
      pagination: false,
      req,
      where: {
        parent: {
          equals: id,
        },
      },
    });

    await Promise.all(versions.docs.map(async (versionDoc: TypeWithVersion<Record<string, unknown>>) => {
      const versionData = versionDoc.version;

      if (!versionData || typeof versionData !== 'object') {
        return;
      }

      const strippedVersion = stripLocale({
        configBlocks,
        data: versionData,
        fields: collectionConfig.fields,
        locale,
      });

      await payload.db.updateVersion({
        collection,
        id: versionDoc.id,
        req,
        returning: false,
        versionData: {
          version: strippedVersion,
        },
      });

      versionsUpdated += 1;
    }));
  }

  return {
    doc: (updatedDoc ?? strippedDoc) as unknown as RawDocument,
    versionsUpdated,
  };
};
