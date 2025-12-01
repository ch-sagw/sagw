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
  const statusInRequest = req.data?._status;

  // Prevent publishing (changing to published)
  // Translators can only save drafts, not publish documents
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

  // Prevent explicit unpublishing: if document was published
  // and user explicitly set status to draft
  // (without editing other content), block it. But if they're
  // editing content, allow saving as draft.
  if (oldStatus === 'published' && newStatus === 'draft' && statusInRequest === 'draft') {
    // Check if this is ONLY a status change (unpublishing) vs editing content
    // If _status was explicitly provided in request and no other
    // meaningful fields changed, it's unpublishing
    const hasOtherChanges = Object.keys(data)
      .some((key) => {
        if (key === '_status' || key === 'updatedAt' || key === 'createdAt' || key === 'id') {
          return false;
        }
        // Check if field value actually changed
        const oldValue = originalDoc?.[key];
        const newValue = data[key];

        return JSON.stringify(oldValue) !== JSON.stringify(newValue);
      });

    // If only status changed (no other content changes), block unpublishing
    if (!hasOtherChanges) {
      throw new ValidationError({
        errors: [
          {
            message: 'You are not allowed to publish or unpublish documents. You can only save drafts.',
            path: '_status',
          },
        ],
      });
    }
  }

  // Ensure status is draft or null (translators can only save drafts,
  // not publish)
  // Don't override if status is already draft or null/undefined
  if (newStatus !== 'draft' && newStatus !== null && newStatus !== undefined) {
    data._status = 'draft';
  }

  return data;
};

