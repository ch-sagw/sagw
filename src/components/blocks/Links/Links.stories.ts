import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  type InterfaceLinksClientPropTypes, LinksClient,
} from '@/components/blocks/Links/Links.client';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof LinksClient> & {
  args: InterfaceLinksClientPropTypes;
};

const meta: Meta<typeof LinksClient> = {
  args: {},
  component: LinksClient,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Links',
};

export default meta;

export const LinksBlock: StrictStory = {
  args: {
    items: [
      {
        link: {
          href: '/example-page-1',
          target: '_self' as const,
        },
        text: rteToHtml(simpleRteConfig('This is a description for the first internal link.')),
        title: rteToHtml(simpleRteConfig('Internal Link 1')),
        type: 'link' as const,
      },
      {
        link: {
          href: 'https://example.com',
          target: '_blank' as const,
        },
        text: rteToHtml(simpleRteConfig('This is a description for an external link.')),
        title: rteToHtml(simpleRteConfig('External Link')),
        type: 'link' as const,
      },
      {
        link: {
          href: 'mailto:contact@example.com',
          target: '_blank' as const,
        },
        text: '',
        title: rteToHtml(simpleRteConfig('Contact Email')),
        type: 'link' as const,
      },
    ],
    titleHtml: rteToHtml(simpleRteConfig('Links Block Title')),
  },
};
