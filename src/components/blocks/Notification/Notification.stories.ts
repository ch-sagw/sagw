import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Notification } from '@/components/blocks/Notification/Notification';
import { defaultDecorator } from '@/storybook-helpers';
import { sampleRte2 } from '@/components/base/Rte/Rte.sampleContent';

type NotificationProps = React.ComponentProps<typeof Notification>;

type StrictStory = StoryObj<typeof Notification> & {
  args: NotificationProps;
};

const meta: Meta<typeof Notification> = {
  args: {},
  component: Notification,
  decorators: [defaultDecorator],
  parameters: {

    /* layout: 'centered', */
    controls: {
      exclude: [
        'id',
        'blockName',
        'blockType',
      ],
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Notification',
};

export default meta;

export const SampleNotification: StrictStory = {
  args: {
    blockName: 'foo',
    blockType: 'notificationBlock',
    text: {
      content: sampleRte2,
    },
  },
};

