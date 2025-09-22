import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FormNotification } from '@/components/base/FormNotification/FormNotification';
import { defaultDecorator } from '@/storybook-helpers';

type FormNotificationProps = React.ComponentProps<typeof FormNotification>;

type StrictStory = StoryObj<typeof FormNotification> & {
  args: FormNotificationProps;
};

const meta: Meta<typeof FormNotification> = {
  args: {},
  component: FormNotification,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/FormNotification',
};

export default meta;

export const WhiteSuccess: StrictStory = {
  args: {
    actionText: 'Erneut senden',
    colorMode: 'white',
    onAction: () => {
      console.log('some click action');
    },
    text: 'Danke für Ihre Anmeldung. Wir haben Ihnen eine E-Mail an die angegebene Adresse gesandt. Um Ihre Anmeldung zu bestätigen, klicken Sie auf den Link im E-Mail.',
    title: 'Anmeldung per E-Mail bestätigen',
    type: 'success',
  },
};

export const DarkSuccess: StrictStory = {
  args: {
    actionText: 'Erneut senden',
    colorMode: 'dark',
    onAction: () => {
      console.log('some click action');
    },
    text: 'Danke für Ihre Anmeldung. Wir haben Ihnen eine E-Mail an die angegebene Adresse gesandt. Um Ihre Anmeldung zu bestätigen, klicken Sie auf den Link im E-Mail.',
    title: 'Anmeldung per E-Mail bestätigen',
    type: 'success',
  },
};

export const Error: StrictStory = {
  args: {
    actionText: 'Erneut senden',
    colorMode: 'dark',
    onAction: () => {
      console.log('some click action');
    },
    text: 'Danke für Ihre Anmeldung. Wir haben Ihnen eine E-Mail an die angegebene Adresse gesandt. Um Ihre Anmeldung zu bestätigen, klicken Sie auf den Link im E-Mail.',
    title: 'Anmeldung per E-Mail bestätigen',
    type: 'error',
  },
};

export const WithoutActionText: StrictStory = {
  args: {
    colorMode: 'dark',
    text: 'Danke für Ihre Anmeldung. Wir haben Ihnen eine E-Mail an die angegebene Adresse gesandt. Um Ihre Anmeldung zu bestätigen, klicken Sie auf den Link im E-Mail.',
    title: 'Anmeldung per E-Mail bestätigen',
    type: 'success',
  },
};
