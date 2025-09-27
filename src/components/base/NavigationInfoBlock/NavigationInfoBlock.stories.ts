import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NavigationInfoBlock } from '@/components/base/NavigationInfoBlock/NavigationInfoBlock';
import { defaultDecorator } from '@/storybook-helpers';

type NavigationInfoBlockProps = React.ComponentProps<typeof NavigationInfoBlock>;

type StrictStory = StoryObj<typeof NavigationInfoBlock> & {
  args: NavigationInfoBlockProps;
};

const meta: Meta<typeof NavigationInfoBlock> = {
  args: {},
  component: NavigationInfoBlock,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/NavigationInfoBlock',
};

export default meta;

export const InfoBlockDark: StrictStory = {
  args: {
    colorMode: 'dark',
    text: 'Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft',
    title: 'Aktivitäten',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const InfoBlockLight: StrictStory = {
  args: {
    colorMode: 'light',
    text: 'Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft',
    title: 'Aktivitäten',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const InfoBlockWhite: StrictStory = {
  args: {
    colorMode: 'white',
    text: 'Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft',
    title: 'Aktivitäten',
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};
