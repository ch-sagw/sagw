import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Button } from '@/components/base/Button/Button';
import { defaultDecorator } from '@/storybook-helpers';

type ButtonProps = React.ComponentProps<typeof Button>;

type StrictStory = StoryObj<typeof Button> & {
  args: ButtonProps;
};

const meta: Meta<typeof Button> = {
  args: {},
  component: Button,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Button',
};

export default meta;

export const SampleButton: StrictStory = {
  args: {
    text: 'Sample Button text',
  },
};

