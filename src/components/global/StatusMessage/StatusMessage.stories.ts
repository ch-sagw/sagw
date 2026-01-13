import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  type InterfaceStatusMessageClientPropTypes, StatusMessageClient,
} from '@/components/global/StatusMessage/StatusMessage.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof StatusMessageClient> & {
  args: InterfaceStatusMessageClientPropTypes;
};

const meta: Meta<typeof StatusMessageClient> = {
  args: {},
  component: StatusMessageClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/StatusMessage',
};

export default meta;

export const SuccessMessage: StrictStory = {
  args: {
    linkHref: undefined,
    linkTextHtml: undefined,
    messageHtml: rteToHtml(simpleRteConfig('This is a success message.')),
    titleHtml: rteToHtml(simpleRteConfig('Success')),
    type: 'success',
  },
};

export const ErrorMessage: StrictStory = {
  args: {
    linkHref: undefined,
    linkTextHtml: undefined,
    messageHtml: rteToHtml(simpleRteConfig('This is an error message.')),
    titleHtml: rteToHtml(simpleRteConfig('Error')),
    type: 'error',
  },
};

export const WarningMessage: StrictStory = {
  args: {
    linkHref: undefined,
    linkTextHtml: undefined,
    messageHtml: rteToHtml(simpleRteConfig('This is a warning message.')),
    titleHtml: rteToHtml(simpleRteConfig('Warning')),
    type: 'warn',
  },
};

export const WithLink: StrictStory = {
  args: {
    linkHref: '/example-page',
    linkTextHtml: rteToHtml(simpleRteConfig('Learn More')),
    messageHtml: rteToHtml(simpleRteConfig('This is a message with a link.')),
    titleHtml: rteToHtml(simpleRteConfig('Status Message')),
    type: 'success',
  },
};
