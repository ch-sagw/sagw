import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Accordion } from '@/components/blocks/Accordion/Accordion';
import { defaultDecorator } from '@/storybook-helpers';
import {
  rte3AccordionContent, sampleRtePrivacyCheckbox,
} from '@/utilities/rteSampleContent';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type AccordionProps = React.ComponentProps<typeof Accordion>;

type StrictStory = StoryObj<typeof Accordion> & {
  args: AccordionProps;
};

const meta: Meta<typeof Accordion> = {
  args: {},
  component: Accordion,
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
    accordionContent: rte3AccordionContent,
    accordionTitle: simpleRteConfig('Title 1'),
    id: '1',
  },
  {
    accordionContent: sampleRtePrivacyCheckbox,
    accordionTitle: simpleRteConfig('Title 2'),
    id: '2',
  },
  {
    accordionContent: rte3AccordionContent,
    accordionTitle: simpleRteConfig('Title 3'),
    id: '3',
  },
  {
    accordionContent: sampleRtePrivacyCheckbox,
    accordionTitle: simpleRteConfig('Title 4'),
    id: '4',
  },
  {
    accordionContent: rte3AccordionContent,
    accordionTitle: simpleRteConfig('Title 5'),
    id: '5',
  },
];

export const BackgroundWhite: StrictStory = {
  args: {
    accordions: items,
    blockType: 'accordionBlock',
    colorMode: 'white',
    title: simpleRteConfig('Accordion title'),
    titleLevel: '2',
  },
};

export const BackgroundLight: StrictStory = {
  args: {
    accordions: items,
    blockType: 'accordionBlock',
    colorMode: 'light',
    title: simpleRteConfig('Accordion title'),
    titleLevel: '2',
  },
};

export const BackgroundDark: StrictStory = {
  args: {
    accordions: items,
    blockType: 'accordionBlock',
    colorMode: 'dark',
    title: simpleRteConfig('Accordion title'),
    titleLevel: '2',
  },
};
