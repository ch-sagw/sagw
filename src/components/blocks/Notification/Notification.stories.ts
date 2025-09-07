import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Notification } from '@/components/blocks/Notification/Notification';
import { defaultDecorator } from '@/storybook-helpers';
import { sampleRte2 } from '@/components/base/Rte/Rte.sampleContent';

const meta: Meta<typeof Notification> = {
  args: {},
  component: Notification,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/Blocks/Notification',
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const SampleNotification: Story = {
  args: {
    text: {
      content: sampleRte2,
    },
  },
};

