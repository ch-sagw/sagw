import {
  CollectionBeforeChangeHook, ValidationError,
} from 'payload';
import { isTranslator } from '@/collections/Plc/Users/roles';

/**
 * Prevents translators from using bulk publish/unpublish actions in list view.
 * Translators can only save drafts, not publish or unpublish documents.
 */
export const hookPreventBulkPublishForTranslators: CollectionBeforeChangeHook = ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update' || !isTranslator(req)) {
    return data;
  }

  const newStatus = data?._status;
  const oldStatus = originalDoc?._status;

  // Prevent publishing (changing to published)
  if (newStatus === 'published') {
    throw new ValidationError({
      errors: [
        {
          message: 'You are not allowed to publish or unpublish documents. You can only save drafts.',
          path: '_status',
        },
      ],
    });
  }

  // Prevent unpublishing (changing from published to draft)
  if (oldStatus === 'published' && (newStatus === 'draft' || newStatus === null)) {
    throw new ValidationError({
      errors: [
        {
          message: 'You are not allowed to publish or unpublish documents. You can only save drafts.',
          path: '_status',
        },
      ],
    });
  }

  return data;
};

