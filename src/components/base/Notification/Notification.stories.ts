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
    type: 'warn',
  },
};

export const WithRteContent: StrictStory = {
  args: {
    ...defaultProps,
    actionText: undefined,
    hideBorder: true,
    hideIcon: true,
    linkHref: undefined,
    linkText: undefined,
    onAction: undefined,
    text: 'Some link text <b>bold</b> <a href="#">link<svg role="presentation" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8184 9.18177L21 1" strokewidth="1.5"></path><path d="M20.9994 7.54542L20.9984 1.00102L14.4541 1" strokelinecap="square" strokewidth="1.5"></path><path d="M17.727 10.8181V18.1817C17.727 18.3987 17.727 18.9999 17.727 18.9999C17.727 18.9999 17.1258 18.9999 16.9089 18.9999H3.81817C3.60118 18.9999 3 18.9999 3 18.9999C3 18.9999 3 18.3987 3 18.1817V5.09088C3 4.87389 3 4.27271 3 4.27271C3 4.27271 3.60118 4.27271 3.81817 4.27271H11.1817" strokewidth="1.5"></path></svg></a>',
    type: 'success',
  },
};
