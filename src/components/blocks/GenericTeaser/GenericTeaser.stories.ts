import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  GenericTeaserClient, type InterfaceGenericTeaserClientPropTypes,
} from '@/components/blocks/GenericTeaser/GenericTeaser.client';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof GenericTeaserClient> & {
  args: InterfaceGenericTeaserClientPropTypes;
};

const meta: Meta<typeof GenericTeaserClient> = {
  args: {},
  component: GenericTeaserClient,
  decorators: [defaultDecoratorNoPadding],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/GenericTeaser',
};

export default meta;

export const Horizontal: StrictStory = {
  args: {
    alignment: 'horizontal',
    subtitleHtml: rteToHtml(simpleRteConfig('This is a subtitle for the generic teaser block.')),
    teasers: [
      {
        id: '1',
        link: {
          href: '/example-page-1',
          text: 'Learn More',
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the first teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Teaser Title 1')),
      },
      {
        id: '2',
        link: {
          href: 'https://example.com',
          text: 'Visit Site',
          type: 'external',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the second teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Teaser Title 2')),
      },
      {
        id: '3',
        link: {
          href: 'mailto:contact@example.com',
          text: 'Contact',
          type: 'mail',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the third teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Teaser Title 3')),
      },
    ],
    titleHtml: rteToHtml(simpleRteConfig('Generic Teaser Block Title')),
  },
};

export const Vertical: StrictStory = {
  args: {
    alignment: 'vertical',
    subtitleHtml: rteToHtml(simpleRteConfig('This is a subtitle for the generic teaser block with vertical alignment.')),
    teasers: [
      {
        id: '1',
        link: {
          href: '/example-page-1',
          text: 'Learn More',
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the first teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Teaser Title 1')),
      },
      {
        id: '2',
        link: {
          href: '/example-page-2',
          text: 'Read More',
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the second teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Teaser Title 2')),
      },
    ],
    titleHtml: rteToHtml(simpleRteConfig('Generic Teaser Block Title')),
  },
};
