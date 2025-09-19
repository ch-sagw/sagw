import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Accordion } from '@/components/base/Accordion/Accordion';
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
  title: 'Components/base/Accordion',
};

export default meta;

export const DefaultAccordion: StrictStory = {
  args: {
    items: [
      {
        content: sampleRte2,
        title: 'Title 1',
      },
      {
        content: sampleRtePrivacyCheckbox,
        title: 'Title 2',
      },
      {
        content: sampleRte2,
        title: 'Title 3',
      },
      {
        content: sampleRtePrivacyCheckbox,
        title: 'Title 4',
      },
      {
        content: sampleRte2,
        title: 'Title 5',
      },
    ],
    titleLevel: 4,
  },
};
