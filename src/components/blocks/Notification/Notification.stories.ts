import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Notification } from '@/components/blocks/Notification/Notification';
import { defaultDecorator } from '@/storybook-helpers';
import { InterfaceNotification } from '@/payload-types';
import { sampleRteText } from '@/richtext-converter/sample-rte-content';

const meta: Meta<typeof Notification> = {
  args: {},
  component: Notification,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
  ],
  title: 'Components/Blocks/Notification',
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const SampleNotification: Story = {
  args: {
    text: sampleRteText as InterfaceNotification['text'],
  },
};

