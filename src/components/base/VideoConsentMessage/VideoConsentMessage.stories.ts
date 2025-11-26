import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { VideoConsentMessage } from '@/components/base/VideoConsentMessage/VideoConsentMessage';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type VideoConsentMessageProps = React.ComponentProps<typeof VideoConsentMessage>;

type StrictStory = StoryObj<typeof VideoConsentMessage> & {
  args: VideoConsentMessageProps;
};

const meta: Meta<typeof VideoConsentMessage> = {
  args: {},
  component: VideoConsentMessage,
  decorators: [defaultDecoratorNoPadding],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/VideoConsentMessage',
};

export default meta;

export const VideoConsentMessageDE: StrictStory = {
  args: {
    pageLanguage: 'de',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
