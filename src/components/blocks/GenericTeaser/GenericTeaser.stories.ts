import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericTeaser } from '@/components/blocks/GenericTeaser/GenericTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { InterfaceGenericTeasersBlock } from '@/payload-types';

type GenericTeaserProps = React.ComponentProps<typeof GenericTeaser>;

type StrictStory = StoryObj<typeof GenericTeaser> & {
  args: GenericTeaserProps;
};

const meta: Meta<typeof GenericTeaser> = {
  args: {},
  component: GenericTeaser,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/GenericTeaser',
};

export default meta;

const teaserBlock: InterfaceGenericTeasersBlock['teasers'][number] = {
  linkInternal: {
    internalLink: {
      documentId: '1234',
      slug: 'projectDetailPage',
    },
    linkText: simpleRteConfig('Zu den Instituten.'),
  },
  linkType: 'internal',
  text: simpleRteConfig('Fünf langfristige Forschungsinfrastrukturen führt die SAGW in Eigenregie und hat die Förderverantwortung.'),
  title: simpleRteConfig('Institute'),
};

export const GenericTeasers: StrictStory = {
  args: {
    alignement: 'horizontal',
    blockType: 'genericTeasersBlock',
    lead: simpleRteConfig('Die SAGW ist eine der wichtigsten Trägerinnen von langfristigen Forschungsinfrastrukturen in der Schweiz.'),
    teasers: [
      teaserBlock,
      teaserBlock,
      teaserBlock,
      teaserBlock,
    ],
    title: simpleRteConfig('Unsere Forschungsinfrastrukturen'),
  },
};
