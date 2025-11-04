import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Notification } from '@/components/base/Notification/Notification';
import { defaultDecorator } from '@/storybook-helpers';

type NotificationProps = React.ComponentProps<typeof Notification>;

type StrictStory = StoryObj<typeof Notification> & {
  args: NotificationProps;
};

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
  title: 'Components/base/Notification',
};

export default meta;

const defaultProps: NotificationProps = {
  actionText: 'Erneut senden',
  colorMode: 'white',
  onAction: () => {
    console.log('some click action');
  },
  text: 'Danke für Ihre Anmeldung. Wir haben Ihnen eine E-Mail an die angegebene Adresse gesandt. Um Ihre Anmeldung zu bestätigen, klicken Sie auf den Link im E-Mail.',
  title: 'Anmeldung per E-Mail bestätigen',
  type: 'success',
};

export const WhiteSuccess: StrictStory = {
  args: defaultProps,
};

export const DarkSuccess: StrictStory = {
  args: {
    ...defaultProps,
    colorMode: 'dark',
  },
};

export const Error: StrictStory = {
  args: {
    ...defaultProps,
    colorMode: 'dark',
    type: 'error',
  },
};

export const Warn: StrictStory = {
  args: {
    ...defaultProps,
    colorMode: 'dark',
    type: 'warn',
  },
};

export const NoBorder: StrictStory = {
  args: {
    ...defaultProps,
    hideBorder: true,
    type: 'warn',
  },
};

export const WithoutActionText: StrictStory = {
  args: {
    ...defaultProps,
    actionText: undefined,
    colorMode: 'dark',
    onAction: undefined,
  },
};

export const WithLink: StrictStory = {
  args: {
    ...defaultProps,
    actionText: undefined,
    hideBorder: true,
    linkHref: 'https://www.foo.bar',
    linkText: 'Some link text',
    onAction: undefined,
    pageLanguage: 'de',
    type: 'warn',
  },
};
