import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Rte } from '@/components/blocks/Rte/Rte';
import { } from '@/components/base/types/rte';
import { defaultDecorator } from '@/storybook-helpers';
import {
  rte4FullRange,
  rte4FullRangeStartingParagraph,
} from '@/utilities/rteSampleContent';

type RteProps = React.ComponentProps<typeof Rte>;

type StrictStory = StoryObj<typeof Rte> & {
  args: RteProps;
};

const meta: Meta<typeof Rte> = {
  args: {},
  component: Rte,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Rte',
};

export default meta;

export const RteWhite: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: true,
    text: rte4FullRange,
  },
};

export const RteWhiteWithoutTitle: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: true,
    text: rte4FullRangeStartingParagraph,
  },
};

export const RteLight: StrictStory = {
  args: {
    colorMode: 'light',
    stickyFirstTitle: true,
    text: rte4FullRange,
  },
};

export const RteDark: StrictStory = {
  args: {
    colorMode: 'dark',
    stickyFirstTitle: true,
    text: rte4FullRange,
  },
};

