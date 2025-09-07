import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Button } from '@/components/base/Button/Button';
import { defaultDecorator } from '@/storybook-helpers';

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
  title: 'Components/Base/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

export const SampleButton: Story = {
  args: {
    text: 'Sample Button text',
  },
};

