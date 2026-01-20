import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  type InterfaceNotificationClientPropTypes, NotificationClient,
} from '@/components/blocks/Notification/Notification.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof NotificationClient> & {
  args: InterfaceNotificationClientPropTypes;
};

const meta: Meta<typeof NotificationClient> = {
  args: {},
  component: NotificationClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
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
    textHtml: rteToHtml(simpleRteConfig('This is a sample notification message. It can contain <strong>rich text</strong> and <a href="#">links</a>.')),
  },
};
