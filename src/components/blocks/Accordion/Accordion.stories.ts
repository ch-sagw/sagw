import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Accordion } from '@/components/blocks/Accordion/Accordion';
import { defaultDecorator } from '@/storybook-helpers';
import {
  sampleRte2, sampleRtePrivacyCheckbox,
} from '@/components/base/Rte/Rte.sampleContent';

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
    accordionContent: {
      content: sampleRte2,
    },
    accordionTitle: 'Title 1',
    id: '1',
  },
  {
    accordionContent: {
      content: sampleRtePrivacyCheckbox,
    },
    accordionTitle: 'Title 2',
    id: '2',
  },
  {
    accordionContent: {
      content: sampleRte2,
    },
    accordionTitle: 'Title 3',
    id: '3',
  },
  {
    accordionContent: {
      content: sampleRtePrivacyCheckbox,
    },
    accordionTitle: 'Title 4',
    id: '4',
  },
  {
    accordionContent: {
      content: sampleRte2,
    },
    accordionTitle: 'Title 5',
    id: '5',
  },
];

export const BackgroundWhite: StrictStory = {
  args: {
    accordions: items,
    blockType: 'accordionBlock',
    colorMode: 'white',
    title: 'Accordion title',
    titleLevel: '4',
  },
};

export const BackgroundLight: StrictStory = {
  args: {
    accordions: items,
    blockType: 'accordionBlock',
    colorMode: 'light',
    title: 'Accordion title',
    titleLevel: '4',
  },
};

export const BackgroundDark: StrictStory = {
  args: {
    accordions: items,
    blockType: 'accordionBlock',
    colorMode: 'dark',
    title: 'Accordion title',
    titleLevel: '4',
  },
};
