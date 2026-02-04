import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  AccordionClient, type InterfaceAccordionClientPropTypes,
} from '@/components/blocks/Accordion/Accordion.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof AccordionClient> & {
  args: InterfaceAccordionClientPropTypes;
};

const meta: Meta<typeof AccordionClient> = {
  args: {},
  component: AccordionClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Accordion',
};

export default meta;

const items = [
  {
    accordionContentHtml: '<p>Content for accordion item 1. This is sample content that would normally come from RTE.</p>',
    accordionTitle: rteToHtml(simpleRteConfig('Title 1')),
    id: '1',
  },
  {
    accordionContentHtml: '<p>Content for accordion item 2. This is sample content that would normally come from RTE.</p>',
    accordionTitle: rteToHtml(simpleRteConfig('Title 2')),
    id: '2',
  },
  {
    accordionContentHtml: '<p>Content for accordion item 3. This is sample content that would normally come from RTE.</p>',
    accordionTitle: rteToHtml(simpleRteConfig('Title 3')),
    id: '3',
  },
  {
    accordionContentHtml: '<p>Content for accordion item 4. This is sample content that would normally come from RTE.</p>',
    accordionTitle: rteToHtml(simpleRteConfig('Title 4')),
    id: '4',
  },
  {
    accordionContentHtml: '<p>Content for accordion item 5. This is sample content that would normally come from RTE.</p>',
    accordionTitle: rteToHtml(simpleRteConfig('Title 5')),
    id: '5',
  },
];

export const BackgroundWhite: StrictStory = {
  args: {
    accordions: items,
    colorMode: 'white',
    title: rteToHtml(simpleRteConfig('Accordion title')),
  },
};

export const BackgroundLight: StrictStory = {
  args: {
    accordions: items,
    colorMode: 'light',
    title: rteToHtml(simpleRteConfig('Accordion title')),
  },
};

export const BackgroundDark: StrictStory = {
  args: {
    accordions: items,
    colorMode: 'dark',
    title: rteToHtml(simpleRteConfig('Accordion title')),
  },
};
