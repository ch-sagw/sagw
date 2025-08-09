import { Block } from 'payload';

export const ContactAccordionItemBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      hasMany: true,
      name: 'category',
      relationTo: 'people',
      required: true,
      type: 'relationship',
    },
  ],
  labels: {
    plural: 'Contact Accordion Item Blocks',
    singular: 'Contact Accordion Item Block',
  },
  slug: 'contactAccordionItem',
};
