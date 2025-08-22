import {
  CollectionAfterChangeHook, CollectionConfig,
} from 'payload';
import slugify from 'slugify';
import { rte2 } from '@/field-templates/rte';

const generateReadableId: CollectionAfterChangeHook = async ({
  doc, operation, req,
}) => {
  if (operation === 'create' || operation === 'update') {
    const readableId = slugify(doc.question, {
      lower: true,
      strict: true,
    });

    // Only update if it’s missing or needs refresh
    if (doc.readableId !== readableId) {
      await req.payload.update({
        collection: 'faqItems',
        data: {
          readableId,
        },
        id: doc.id,
      });
    }
  }

  return doc;
};

export const FaqItems: CollectionConfig = {
  admin: {
    group: 'Global Content',
    useAsTitle: 'question',
  },
  fields: [
    {
      localized: true,
      name: 'question',
      required: true,
      type: 'text',
    },
    {
      editor: rte2,
      localized: true,
      name: 'answer',
      required: true,
      type: 'richText',
    },
    {
      admin: {
        hidden: true,
        readOnly: true,
      },
      name: 'readableId',
      type: 'text',
      unique: true,
    },
  ],
  hooks: {
    afterChange: [generateReadableId],
  },
  slug: 'faqItems',
};
