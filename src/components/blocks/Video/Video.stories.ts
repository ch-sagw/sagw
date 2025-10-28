import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Video } from '@/components/blocks/Video/Video';
import { defaultDecorator } from '@/storybook-helpers';
import {
  ContentImageCentered,
  ContentImageLeftAligned,
  ContentImageRightAligned,
} from '@/components/blocks/Figure/Figure.stories';

type VideoProps = React.ComponentProps<typeof Video>;

type StrictStory = StoryObj<typeof Video> & {
  args: VideoProps;
};

const meta: Meta<typeof Video> = {
  args: {},
  component: Video,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Video',
};

export default meta;

export const VideoCentered: StrictStory = {
  args: {
    alignment: ContentImageCentered.args.alignment,
    stillImage: ContentImageCentered.args,
    video: {
      duration: '',
      id: '',
      title: '',
    },
  },
};

export const ContentVideoLeftAligned: StrictStory = {
  args: {
    alignment: ContentImageLeftAligned.args.alignment,
    stillImage: ContentImageLeftAligned.args,
    video: {
      duration: '',
      id: '',
      title: '',
    },
  },
};

export const ContentVideoRightAligned: StrictStory = {
  args: {
    alignment: ContentImageRightAligned.args.alignment,
    stillImage: ContentImageRightAligned.args,
    video: {
      duration: '',
      id: '',
      title: '',
    },
  },
};
