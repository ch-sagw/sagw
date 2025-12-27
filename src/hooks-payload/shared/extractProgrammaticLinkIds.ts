import {
  type BasePayload, type TypedLocale,
} from 'payload';
import {
  fetchEventDetailPages,
  fetchMagazinePages,
  fetchNewsOverviewPages,
  fetchNewsTeaserPages,
  fetchProjectsPages,
} from '@/data/fetch';
import { getPayloadCached } from '@/utilities/getPayloadCached';

interface InterfaceExtractProgrammaticLinkIdsContext {
  tenant?: string;
  locale?: TypedLocale;
  currentPageId?: string;
  collectionSlug?: string;
  payload?: BasePayload;
}

// Recursively finds all blocks in a document
export const findBlocks = (obj: unknown, blocks: unknown[] = []): unknown[] => {
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

interface InterfaceCreateEventsTeaserOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for events teaser
const createEventsTeaserOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateEventsTeaserOperationParams): Promise<void> => {
  try {
    const eventPages = await fetchEventDetailPages({
      depth: 0,
      language: locale,
      limit: 3,
      payload,
      tenant,
    });

    eventPages.forEach((event) => {
      if (event.id) {
        linkIds.add(String(event.id));
      }
    });
  } catch (error) {
    console.error('Error fetching event pages for eventsTeasersBlock:', error);
  }
};

interface InterfaceCreateNewsTeaserOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  currentPageId?: string;
  collectionSlug?: string;
  payload?: BasePayload;
}

// Helper to create async operation for news teaser
const createNewsTeaserOperation = async ({
  locale,
  tenant,
  linkIds,
  currentPageId,
  collectionSlug,
  payload,
}: InterfaceCreateNewsTeaserOperationParams): Promise<void> => {
  try {
    // Exclude current page if we're on a newsDetailPage
    const excludePageId = collectionSlug === 'newsDetailPage' && currentPageId
      ? currentPageId
      : undefined;

    const newsPages = await fetchNewsTeaserPages({
      depth: 0,
      excludePageId,
      locale,
      payload,
      tenant,
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

interface InterfaceCreateEventsOverviewOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for events overview
const createEventsOverviewOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateEventsOverviewOperationParams): Promise<void> => {
  try {
    const eventPages = await fetchEventDetailPages({
      depth: 0,
      language: locale,
      limit: 0,
      payload,
      tenant,
    });

    eventPages.forEach((event) => {
      if (event.id) {
        linkIds.add(String(event.id));
      }
    });
  } catch (error) {
    console.error('Error fetching event pages for eventsOverviewBlock:', error);
  }
};

interface InterfaceCreateNewsOverviewOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for news overview
const createNewsOverviewOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateNewsOverviewOperationParams): Promise<void> => {
  try {
    const newsPages = await fetchNewsOverviewPages({
      depth: 0,
      locale,
      payload,
      tenant,
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

interface InterfaceCreateMagazineTeaserOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for magazine teaser
const createMagazineTeaserOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateMagazineTeaserOperationParams): Promise<void> => {
  try {
    const magazinePages = await fetchMagazinePages({
      limit: 4,
      locale,
      payload,
      tenant,
    });

    magazinePages.forEach((magazine) => {
      if (magazine.id) {
        linkIds.add(String(magazine.id));
      }
    });
  } catch (error) {
    console.error('Error fetching magazine pages for magazineTeasersBlock:', error);
  }
};

interface InterfaceCreateProjectsTeaserOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for projects teaser
const createProjectsTeaserOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateProjectsTeaserOperationParams): Promise<void> => {
  try {
    const projectPages = await fetchProjectsPages({
      limit: 3,
      locale,
      payload,
      tenant,
    });

    projectPages.forEach((project) => {
      if (project.id) {
        linkIds.add(String(project.id));
      }
    });
  } catch (error) {
    console.error('Error fetching project pages for projectsTeasersBlock:', error);
  }
};

interface InterfaceCreateMagazineOverviewOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for magazine overview
const createMagazineOverviewOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateMagazineOverviewOperationParams): Promise<void> => {
  try {
    const magazinePages = await fetchMagazinePages({
      limit: 0,
      locale,
      payload,
      tenant,
    });

    magazinePages.forEach((magazine) => {
      if (magazine.id) {
        linkIds.add(String(magazine.id));
      }
    });
  } catch (error) {
    console.error('Error fetching magazine pages for magazineOverviewBlock:', error);
  }
};

interface InterfaceCreateProjectsOverviewOperationParams {
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for projects overview
const createProjectsOverviewOperation = async ({
  locale,
  tenant,
  linkIds,
  payload,
}: InterfaceCreateProjectsOverviewOperationParams): Promise<void> => {
  try {
    const projectPages = await fetchProjectsPages({
      limit: 0,
      locale,
      payload,
      tenant,
    });

    projectPages.forEach((project) => {
      if (project.id) {
        linkIds.add(String(project.id));
      }
    });
  } catch (error) {
    console.error('Error fetching project pages for projectsOverviewBlock:', error);
  }
};

// Helper to extract RTE link IDs (reused from extractAllLinkIds logic)
const extractRteLinkIds = (rteContent: Record<string, unknown>, linkIds: Set<string>): void => {
  if (!rteContent || !rteContent.root || typeof rteContent.root !== 'object') {
    return;
  }

  const root = rteContent.root as { children?: unknown[] };

  if (!root.children || !Array.isArray(root.children)) {
    return;
  }

  const processNode = (node: unknown): void => {
    if (!node || typeof node !== 'object') {
      return;
    }

    const nodeRecord = node as Record<string, unknown>;

    if (nodeRecord.type === 'link') {
      const linkNode = nodeRecord as {
        fields?: {
          linkType?: string;
          doc?: {
            value?: string;
          };
        };
      };

      // Check if it's an internal link
      if (linkNode.fields?.linkType === 'internal' && linkNode.fields?.doc?.value) {
        const documentId = typeof linkNode.fields.doc.value === 'string'
          ? linkNode.fields.doc.value
          : null;

        if (documentId) {
          linkIds.add(documentId);
        }
      }
    }

    // Process children recursively
    if ('children' in nodeRecord && nodeRecord.children && Array.isArray(nodeRecord.children)) {
      nodeRecord.children.forEach(processNode);
    }
  };

  root.children.forEach(processNode);
};

interface InterfaceCreateFormBlockOperationParams {
  locale: TypedLocale;
  tenant: string;
  blockRecord: Record<string, unknown>;
  linkIds: Set<string>;
  payload?: BasePayload;
}

// Helper to create async operation for form block
const createFormBlockOperation = async ({
  locale,
  tenant,
  blockRecord,
  linkIds,
  payload: providedPayload,
}: InterfaceCreateFormBlockOperationParams): Promise<void> => {
  try {
    const payload = providedPayload || await getPayloadCached();

    // Get form relationship (could be ID string or populated object)
    const formRef = blockRecord.form;

    if (!formRef) {
      return;
    }

    // Extract form ID
    let formId: string | undefined;

    if (typeof formRef === 'string') {
      formId = formRef;
    } else if (formRef && typeof formRef === 'object' && 'id' in formRef) {
      formId = String(formRef.id);
    }

    if (!formId) {
      return;
    }

    // Fetch form to check showPrivacyCheckbox
    const formDoc = await payload.findByID({
      collection: 'forms',
      depth: 0,
      id: formId,
      locale,
    });

    if (!formDoc || !formDoc.showPrivacyCheckbox) {
      return;
    }

    // Fetch i18nGlobals global for this tenant
    const i18nGlobalsDocs = await payload.find({
      collection: 'i18nGlobals',
      depth: 0,
      limit: 1,
      locale,
      pagination: false,
      where: {
        tenant: {
          equals: tenant,
        },
      },
    });

    if (i18nGlobalsDocs.docs.length === 0) {
      return;
    }

    const [i18nGlobal] = i18nGlobalsDocs.docs;

    // Extract links from dataPrivacyCheckboxText RTE field
    if (i18nGlobal?.forms?.dataPrivacyCheckbox?.dataPrivacyCheckboxText) {
      const dataPrivacyCheckboxText = i18nGlobal.forms.dataPrivacyCheckbox.dataPrivacyCheckboxText as Record<string, unknown>;

      extractRteLinkIds(dataPrivacyCheckboxText, linkIds);
    }
  } catch (error) {
    console.error('Error extracting links from formBlock dataPrivacyCheckboxText:', error);
  }
};

interface InterfaceProcessBlockParams {
  block: unknown;
  locale: TypedLocale;
  tenant: string;
  linkIds: Set<string>;
  asyncOperations: Promise<void>[];
  currentPageId?: string;
  collectionSlug?: string;
  payload?: BasePayload;
}

// Helper to process a single block
const processBlock = ({
  block,
  locale,
  tenant,
  linkIds,
  asyncOperations,
  currentPageId,
  collectionSlug,
  payload,
}: InterfaceProcessBlockParams): void => {
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
    asyncOperations.push(createEventsTeaserOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'newsTeasersBlock') {
    asyncOperations.push(createNewsTeaserOperation({
      collectionSlug,
      currentPageId,
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'magazineTeasersBlock') {
    asyncOperations.push(createMagazineTeaserOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'projectsTeasersBlock') {
    asyncOperations.push(createProjectsTeaserOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'eventsOverviewBlock') {
    asyncOperations.push(createEventsOverviewOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'newsOverviewBlock') {
    asyncOperations.push(createNewsOverviewOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'magazineOverviewBlock') {
    asyncOperations.push(createMagazineOverviewOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'projectsOverviewBlock') {
    asyncOperations.push(createProjectsOverviewOperation({
      linkIds,
      locale,
      payload,
      tenant,
    }));
  } else if (blockType === 'formBlock') {
    asyncOperations.push(createFormBlockOperation({
      blockRecord,
      linkIds,
      locale,
      payload,
      tenant,
    }));
  }
};

export const extractProgrammaticLinkIds = async (
  doc: Record<string, unknown>,
  context?: InterfaceExtractProgrammaticLinkIdsContext,
): Promise<Set<string>> => {
  const linkIds = new Set<string>();

  if (!context?.tenant || !context?.locale) {
    return linkIds;
  }

  try {
    // Find all blocks in the document
    const blocks = findBlocks(doc);

    // Collect async operations to execute in parallel
    const asyncOperations: Promise<void>[] = [];

    // Process each block (tenant and locale are guaranteed to exist here)
    const {
      tenant, locale, currentPageId, collectionSlug, payload,
    } = context;

    for (const block of blocks) {
      processBlock({
        asyncOperations,
        block,
        collectionSlug,
        currentPageId,
        linkIds,
        locale,
        payload,
        tenant,
      });
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

