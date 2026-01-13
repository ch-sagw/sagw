import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  HomeTeaserClient, type InterfaceHomeTeaserClientPropTypes,
} from '@/components/blocks/HomeTeaser/HomeTeaser.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof HomeTeaserClient> & {
  args: InterfaceHomeTeaserClientPropTypes;
};

const meta: Meta<typeof HomeTeaserClient> = {
  args: {},
  component: HomeTeaserClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/HomeTeaser',
};

export default meta;

export const HomeTeasers: StrictStory = {
  args: {
    teasers: [
      {
        category: 'Category 1',
        linkHref: '/example-page-1',
        linkTextHtml: rteToHtml(simpleRteConfig('Learn More')),
        textHtml: rteToHtml(simpleRteConfig('This is the first home teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Home Teaser Title 1')),
      },
      {
        category: 'Category 2',
        linkHref: '/example-page-2',
        linkTextHtml: rteToHtml(simpleRteConfig('Read More')),
        textHtml: rteToHtml(simpleRteConfig('This is the second home teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Home Teaser Title 2')),
      },
      {
        category: 'Category 3',
        linkHref: '/example-page-3',
        linkTextHtml: rteToHtml(simpleRteConfig('Explore')),
        textHtml: rteToHtml(simpleRteConfig('This is the third home teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Home Teaser Title 3')),
      },
    ],
  },
};
