import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { KeyVisual } from '@/components/base/KeyVisual/KeyVisual';
import { defaultDecorator } from '@/storybook-helpers';

type KeyVisualProps = React.ComponentProps<typeof KeyVisual>;

type StrictStory = StoryObj<typeof KeyVisual> & {
  args: KeyVisualProps;
};

const meta: Meta<typeof KeyVisual> = {
  args: {},
  component: KeyVisual,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/KeyVisual',
};

export default meta;

export const KeyVisualElements: StrictStory = {
  args: {
    animation: false,
  },
};
