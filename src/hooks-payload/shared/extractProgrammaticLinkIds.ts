import {
  type BasePayload, type TypedLocale,
} from 'payload';

interface InterfaceExtractProgrammaticLinkIdsContext {
  payload: BasePayload;
  tenant?: string;
  locale?: TypedLocale;
}

// Recursively finds all blocks in a document
const findBlocks = (obj: unknown, blocks: unknown[] = []): unknown[] => {
  if (!obj || typeof obj !== 'object') {
    return blocks;
  }

  const objRecord = obj as Record<string, unknown>;

  if ('blockType' in objRecord && objRecord.blockType) {
    blocks.push(objRecord);
  }

  // Recursively process arrays
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      findBlocks(item, blocks);
    });
  } else {
    // Recursively process object properties
    Object.keys(objRecord)
      .forEach((key) => {
        // Skip certain fields that shouldn't be processed
        if (key !== 'id' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '_status' && key !== 'parentPage') {
          findBlocks(objRecord[key], blocks);
        }
      });
  }

  return blocks;
};

// Helper to create async operation for events teaser
const createEventsTeaserOperation = async (
  payload: BasePayload,
  locale: TypedLocale,
  tenant: string,
  linkIds: Set<string>,
): Promise<void> => {
  try {
    const eventPages = await payload.find({
      collection: 'eventDetailPage',
      depth: 0,
      limit: 0,
      locale,
      pagination: false,
      sort: 'eventDetails.date',
      where: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: {
        /* eslint-enable @typescript-eslint/naming-convention */
          equals: 'published',
        },
        tenant: {
          equals: tenant,
        },
      },
    });

    // Filter out events older than yesterday
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const filteredDocs = eventPages.docs.filter((eventPage) => {
      const eventDate = new Date((eventPage as { eventDetails?: { date?: string } }).eventDetails?.date || '');

      return eventDate > yesterday;
    });

    const limitedDocs = filteredDocs.slice(0, 3);

    limitedDocs.forEach((event) => {
      if (event.id) {
        linkIds.add(String(event.id));
      }
    });
  } catch (error) {
    console.error('Error fetching event pages for eventsTeasersBlock:', error);
  }
};

// Helper to create async operation for news teaser
const createNewsTeaserOperation = async (
  payload: BasePayload,
  locale: TypedLocale,
  tenant: string,
  linkIds: Set<string>,
): Promise<void> => {
  try {
    const newsPages = await payload.find({
      collection: 'newsDetailPage',
      depth: 0,
      limit: 3,
      locale,
      pagination: false,
      sort: '-hero.date',
      where: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: {
        /* eslint-enable @typescript-eslint/naming-convention */
          equals: 'published',
        },
        tenant: {
          equals: tenant,
        },
      },
    });

    newsPages.docs.forEach((news) => {
      if (news.id) {
        linkIds.add(String(news.id));
      }
    });
  } catch (error) {
    console.error('Error fetching news pages for newsTeasersBlock:', error);
  }
};

// Helper to create async operation for events overview
const createEventsOverviewOperation = async (
  payload: BasePayload,
  locale: TypedLocale,
  tenant: string,
  linkIds: Set<string>,
): Promise<void> => {
  try {
    const eventPages = await payload.find({
      collection: 'eventDetailPage',
      depth: 0,
      limit: 0,
      locale,
      pagination: false,
      sort: 'eventDetails.date',
      where: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: {
        /* eslint-enable @typescript-eslint/naming-convention */
          equals: 'published',
        },
        tenant: {
          equals: tenant,
        },
      },
    });

    // Filter out events older than yesterday
    const yesterday = new Date();

    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const filteredDocs = eventPages.docs.filter((eventPage) => {
      const eventDate = new Date((eventPage as { eventDetails?: { date?: string } }).eventDetails?.date || '');

      return eventDate > yesterday;
    });

    filteredDocs.forEach((event) => {
      if (event.id) {
        linkIds.add(String(event.id));
      }
    });
  } catch (error) {
    console.error('Error fetching event pages for eventsOverviewBlock:', error);
  }
};

// Helper to create async operation for news overview
const createNewsOverviewOperation = async (
  payload: BasePayload,
  locale: TypedLocale,
  tenant: string,
  linkIds: Set<string>,
): Promise<void> => {
  try {
    const newsPages = await payload.find({
      collection: 'newsDetailPage',
      depth: 0,
      limit: 0,
      locale,
      pagination: false,
      sort: '-hero.date',
      where: {
        /* eslint-disable @typescript-eslint/naming-convention */
        _status: {
          /* eslint-enable @typescript-eslint/naming-convention */
          equals: 'published',
        },
        tenant: {
          equals: tenant,
        },
      },
    });

    newsPages.docs.forEach((news) => {
      if (news.id) {
        linkIds.add(String(news.id));
      }
    });
  } catch (error) {
    console.error('Error fetching news pages for newsOverviewBlock:', error);
  }
};

// Helper to process a single block
const processBlock = (
  block: unknown,
  payload: BasePayload,
  locale: TypedLocale,
  tenant: string,
  linkIds: Set<string>,
  asyncOperations: Promise<void>[],
): void => {
  if (!block || typeof block !== 'object') {
    return;
  }

  const blockRecord = block as Record<string, unknown>;
  const {
    blockType,
  } = blockRecord;

  if (typeof blockType !== 'string') {
    return;
  }

  // Collect async operations for parallel execution
  if (blockType === 'eventsTeasersBlock') {
    asyncOperations.push(createEventsTeaserOperation(payload, locale, tenant, linkIds));
  } else if (blockType === 'newsTeasersBlock') {
    asyncOperations.push(createNewsTeaserOperation(payload, locale, tenant, linkIds));
  } else if (blockType === 'eventsOverviewBlock') {
    asyncOperations.push(createEventsOverviewOperation(payload, locale, tenant, linkIds));
  } else if (blockType === 'newsOverviewBlock') {
    asyncOperations.push(createNewsOverviewOperation(payload, locale, tenant, linkIds));
  }
};

export const extractProgrammaticLinkIds = async (
  doc: Record<string, unknown>,
  context?: InterfaceExtractProgrammaticLinkIdsContext,
): Promise<Set<string>> => {
  const linkIds = new Set<string>();

  if (!context?.payload || !context?.tenant || !context?.locale) {
    return linkIds;
  }

  try {
    // Find all blocks in the document
    const blocks = findBlocks(doc);

    // Collect async operations to execute in parallel
    const asyncOperations: Promise<void>[] = [];

    // Process each block (tenant and locale are guaranteed to exist here)
    const {
      payload, tenant, locale,
    } = context;

    for (const block of blocks) {
      processBlock(block, payload, locale, tenant, linkIds, asyncOperations);
    }

    // Execute all async operations in parallel
    if (asyncOperations.length > 0) {
      await Promise.all(asyncOperations);
    }
  } catch (error) {
    console.error('Error extracting programmatic link IDs:', error);
  }

  return linkIds;
};

