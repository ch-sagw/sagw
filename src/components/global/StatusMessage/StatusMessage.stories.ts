import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { StatusMessage } from '@/components/global/StatusMessage/StatusMessage';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type StatusMessageProps = React.ComponentProps<typeof StatusMessage>;

type StrictStory = StoryObj<typeof StatusMessage> & {
  args: StatusMessageProps;
};

const meta: Meta<typeof StatusMessage> = {
  args: {},
  component: StatusMessage,
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

const defaultProps: StatusMessageProps = {
  message: simpleRteConfig('Status Message Text'),
  optionalLink: {
    includeLink: true,
    link: {
      internalLink: 'https://www.foo.bar',
      linkText: simpleRteConfig('Some action link'),
    },
  },
  pageLanguage: 'de',
  show: {
    display: 'show',
  },
  showOnHomeOnly: false,
  title: simpleRteConfig('Status Message Title'),
  type: 'warn',
};

export const Warn: StrictStory = {
  args: defaultProps,
};

export const Error: StrictStory = {
  args: {
    ...defaultProps,
    type: 'error',
  },
};

export const Success: StrictStory = {
  args: {
    ...defaultProps,
    type: 'success',
  },
};
