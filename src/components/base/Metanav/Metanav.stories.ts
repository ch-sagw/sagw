import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Metanav } from '@/components/base/Metanav/Metanav';
import { defaultDecorator } from '@/storybook-helpers';

type MetanavProps = React.ComponentProps<typeof Metanav>;

type StrictStory = StoryObj<typeof Metanav> & {
  args: MetanavProps;
};

const meta: Meta<typeof Metanav> = {
  args: {},
  component: Metanav,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Metanav',
};

export default meta;

export const DefaultMetanav: StrictStory = {
  args: {
    items: [
      'foo',
      'bar',
    ],
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
