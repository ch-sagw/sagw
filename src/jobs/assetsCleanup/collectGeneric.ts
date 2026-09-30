import type { InterfaceReferenceIndex } from '@/jobs/assetsCleanup/types';

// ########################################################################
// Generic (schema-agnostic) reference collector
//
// Walks a raw document as plain JSON and collects everything which could
// possibly be a reference to an asset:
// - every 24 hex character string (Mongo ObjectId), also inside urls
// - every token which looks like a filename or url (contains a dot or a
//   slash), in raw, query-stripped and url-decoded form, plus its path
//   basename
// - project ids of downloads blocks in "auto" mode
//
// The collector deliberately does not know the schema.
// ########################################################################

const objectIdPattern = /[a-f0-9]{24}/giu;
const tokenSplitPattern = /[\s"'`<>()[\]{}|,;]+/u;
const minTokenLength = 5;

export const createReferenceIndex = (): InterfaceReferenceIndex => ({
  autoProjects: new Set<string>(),
  filenames: new Set<string>(),
  ids: new Set<string>(),
  urlCorpus: new Set<string>(),
});

export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const safeDecode = (value: string): string | undefined => {
  if (!value.includes('%')) {
    return undefined;
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
};

const stripQueryAndHash = (value: string): string => {
  const queryIndex = value.indexOf('?');
  const hashIndex = value.indexOf('#');
  const cutIndexes = [
    queryIndex,
    hashIndex,
  ].filter((index) => index >= 0);

  if (cutIndexes.length < 1) {
    return value;
  }

  return value.substring(0, Math.min(...cutIndexes));
};

const addTokenVariants = (token: string, index: InterfaceReferenceIndex): void => {
  const variants = new Set<string>([token]);
  const stripped = stripQueryAndHash(token);

  variants.add(stripped);

  const decodedToken = safeDecode(token);
  const decodedStripped = safeDecode(stripped);

  if (decodedToken) {
    variants.add(decodedToken);
  }

  if (decodedStripped) {
    variants.add(decodedStripped);
  }

  variants.forEach((variant) => {
    const trimmed = variant.replace(/[.,:;!?]+$/u, '');

    if (trimmed.length < minTokenLength) {
      return;
    }

    if (trimmed.includes('.')) {
      index.filenames.add(trimmed);
    }

    const basename = trimmed.substring(trimmed.lastIndexOf('/') + 1);

    if (basename && basename !== trimmed && basename.includes('.')) {
      index.filenames.add(basename);
    }

    if (trimmed.includes('/')) {
      index.urlCorpus.add(trimmed);
    }
  });
};

const collectFromString = (value: string, index: InterfaceReferenceIndex): void => {
  if (value.length < minTokenLength) {
    return;
  }

  const idMatches = value.matchAll(objectIdPattern);

  for (const match of idMatches) {
    index.ids.add(match[0].toLowerCase());
  }

  if (!value.includes('.') && !value.includes('/')) {
    return;
  }

  // the whole string (raw and decoded) goes into the corpus. this makes the
  // substring check independent of the tokenization below, e.g. for
  // filenames containing brackets or spaces.
  index.urlCorpus.add(value);

  const decodedValue = safeDecode(value);

  if (decodedValue) {
    index.urlCorpus.add(decodedValue);
  }

  value
    .split(tokenSplitPattern)
    .forEach((token) => {
      if (token.length >= minTokenLength && (token.includes('.') || token.includes('/'))) {
        addTokenVariants(token, index);
      }
    });
};

const collectAutoDownloadsProject = (value: Record<string, unknown>, index: InterfaceReferenceIndex): void => {
  if (value.blockType !== 'downloadsBlock' || value.customOrAuto !== 'auto') {
    return;
  }

  const {
    project,
  } = value;

  if (typeof project === 'string' && project.length > 0) {
    index.autoProjects.add(project.toLowerCase());
  } else if (isRecord(project) && typeof project.id === 'string') {
    index.autoProjects.add(project.id.toLowerCase());
  }
};

export const collectGenericReferences = (value: unknown, index: InterfaceReferenceIndex): void => {
  if (typeof value === 'string') {
    collectFromString(value, index);

    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectGenericReferences(item, index);
    });

    return;
  }

  if (isRecord(value)) {
    collectAutoDownloadsProject(value, index);

    Object.keys(value)
      .forEach((key) => {
        collectGenericReferences(value[key], index);
      });
  }
};
