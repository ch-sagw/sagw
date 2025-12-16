// Generic RTE link processing hook that works for any document structure
// (pages, globals, etc.) - recursively finds and processes all RTE fields.
// Currently only used in i18n  and consent collection.

import { CollectionBeforeValidateHook } from 'payload';
import { generateRteLinkPaths } from '@/hooks-payload/shared/generateRteLinkPaths';
import { removeLinkReferencesForRemovedLinks } from '@/hooks-payload/shared/removeLinkReferencesForRemovedLinks';
import { SYSTEM_FIELDS } from '@/hooks-payload/shared/clearSystemFields';

const processRteFields = async (
  obj: any,
  payload: any,
  currentPageId: string | undefined,
): Promise<any> => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Check if this is an RTE content object (has root.children structure)
  if (obj.root && obj.root.children && Array.isArray(obj.root.children)) {
    const processed = await generateRteLinkPaths({
      currentPageId,
      payload,
      rteContent: obj,
    });

    if (processed && processed.root) {
      return processed;
    }

    return obj;
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    const processedItems = await Promise.all(obj.map((item: any) => processRteFields(item, payload, currentPageId)));

    return processedItems;
  }

  // Recursively process object properties
  const processedObj: any = {
    ...obj,
  };

  await Promise.all(Object.keys(obj)
    .map(async (key) => {
    // Skip certain fields that shouldn't be processed
      if (SYSTEM_FIELDS.includes(key as typeof SYSTEM_FIELDS[number])) {
        return;
      }

      processedObj[key] = await processRteFields(obj[key], payload, currentPageId);
    }));

  return processedObj;
};

export const hookGenerateRteLinkPathsGeneric: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (!data || !req?.payload) {
    return data;
  }

  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  const currentPageId = data.id || originalDoc?.id;

  try {
    if (operation === 'update' && currentPageId && originalDoc) {
      await removeLinkReferencesForRemovedLinks({
        currentDoc: data,
        currentPageId: String(currentPageId),
        originalDoc,
        payload: req.payload,
      });
    }

    const processedData = await processRteFields(data, req.payload, currentPageId
      ? String(currentPageId)
      : undefined);

    return processedData;
  } catch (error) {
    console.error('Error generating RTE link paths:', error);
    console.error('Operation:', operation);

    // Return original data if processing fails
    return data;
  }
};

