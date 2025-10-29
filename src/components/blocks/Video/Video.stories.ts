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
      duration: '00:24',
      id: '68f9e148609b9e4625b4278d',
      title: 'Video Title',
    },
  },
};

export const ContentVideoLeftAligned: StrictStory = {
  args: {
    alignment: ContentImageLeftAligned.args.alignment,
    stillImage: ContentImageLeftAligned.args,
    video: {
      duration: '03:18',
      id: '68f9e148609b9e4625b4278d',
      title: 'Video Title',
    },
  },
};

export const ContentVideoRightAligned: StrictStory = {
  args: {
    alignment: ContentImageRightAligned.args.alignment,
    stillImage: ContentImageRightAligned.args,
    video: {
      duration: '02:34',
      id: '68f9e148609b9e4625b4278d',
      title: 'Video Title',
    },
  },
};
