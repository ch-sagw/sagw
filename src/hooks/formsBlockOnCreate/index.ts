import {
  Block, CollectionBeforeValidateHook,
} from 'payload';

export const hookFormsBlockOnCreate: CollectionBeforeValidateHook = ({
  data, operation,
}) => {

  // only on new documents
  if (operation === 'create') {
    if (data && !data?.content) {
      data.content = [];
    }

    const hasFormBlock = data?.content.some((block: Block) => block.slug === 'formBlock');

    if (!hasFormBlock) {
      data?.content.push({
        blockType: 'formBlock',
        form: null,
      });
    }
  }

  return data;
};
