// Iterate over all blocks and process internal links of blocks which have
// rte3 / rte4 fields.
// -> generate and store paths for all internal links in RTE fields

import { CollectionBeforeValidateHook } from 'payload';
import { generateRteLinkPaths } from '@/hooks-payload/shared/generateRteLinkPaths';
import { BlockSlug } from '@/blocks';
import {
  InterfaceAccordionBlock,
  InterfaceBibliographicReferenceBlock,
  InterfaceFootnotesBlock,
  InterfaceNotificationBlock,
  InterfaceTextBlock,
} from '@/payload-types';
import { removeLinkReferencesForRemovedLinks } from '@/hooks-payload/shared/removeLinkReferencesForRemovedLinks';

export const hookGenerateRteLinkPaths: CollectionBeforeValidateHook = async ({
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

  // blocks are in data.content or data.blocks.content (event-detail-page)
  let blocksContent;
  let blocksDataIsInDataDirectly = true;

  if ('content' in data) {
    blocksContent = data.content;
  }

  if (!blocksContent && 'blocks' in data) {
    blocksDataIsInDataDirectly = false;
    blocksContent = data.blocks.content;
  }

  const blocksWithRte: BlockSlug[] = [
    'textBlock',
    'notificationBlock',
    'footnoteBlock',
    'accordionBlock',
    'bibliographicReferenceBlock',
  ];

  try {
    if (operation === 'update' && currentPageId && originalDoc) {
      await removeLinkReferencesForRemovedLinks({
        currentDoc: data,
        currentPageId: String(currentPageId),
        originalDoc,
        payload: req.payload,
      });
    }

    if (!blocksContent) {
      return data;
    }

    if (blocksContent.length < 1) {
      return data;
    }

    const hasRteBlock = blocksContent.some((item: any) => blocksWithRte.includes(item.blockType));

    if (!hasRteBlock) {
      return data;
    }

    await Promise.all(blocksContent.map(async (item: any) => {
      if (item.blockType === 'accordionBlock') {
        const accordionBlockItem = item as InterfaceAccordionBlock;

        await Promise.all(accordionBlockItem.accordions.map(async (accordionItem) => {
          if (!accordionItem.accordionContent) {
            return;
          }

          const processed = await generateRteLinkPaths({
            currentPageId: currentPageId
              ? String(currentPageId)
              : undefined,
            payload: req.payload,
            rteContent: accordionItem.accordionContent,
          });

          if (processed && processed.root) {
            accordionItem.accordionContent = processed as NonNullable<typeof accordionItem.accordionContent>;
          }
        }));
      } else {
        const textBlockItem =
        item as
          | InterfaceTextBlock
          | InterfaceNotificationBlock
          | InterfaceFootnotesBlock
          | InterfaceBibliographicReferenceBlock;

        if (!textBlockItem.text) {
          return;
        }

        const processed = await generateRteLinkPaths({
          currentPageId: currentPageId
            ? String(currentPageId)
            : undefined,
          payload: req.payload,
          rteContent: textBlockItem.text,
        });

        if (processed && processed.root) {
          textBlockItem.text = processed as NonNullable<typeof textBlockItem.text>;
        }

      }
    }));

    // false positive by the linter: all promises are resolved by now...
    /* eslint-disable require-atomic-updates */
    if (blocksDataIsInDataDirectly) {
      data.content = blocksContent;
    } else {
      data.blocks.content = blocksContent;
    }
    /* eslint-enable require-atomic-updates */

    return data;
  } catch (error) {
    console.error('Error generating RTE link paths:', error);
    console.error('Operation:', operation);
    console.error('Data sample:', JSON.stringify(data)
      .substring(0, 500));

    // Return original data if processing fails
    return data;
  }
};

