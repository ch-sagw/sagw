import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ImageBlock } from '@/components/blocks/Image/Image';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  captionRte1,
  creditsRte1,
} from '@/utilities/rteSampleContent';

type ImageBlockProps = React.ComponentProps<typeof ImageBlock>;

type StrictStory = StoryObj<typeof ImageBlock> & {
  args: ImageBlockProps;
};

const meta: Meta<typeof ImageBlock> = {
  args: {},
  component: ImageBlock,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Image',
};

const imageConfig = {
  alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger. Stewart is centered in a background of clouds and earth in this view of his EVA. He is floating without tethers attaching him to the shuttle.',
  createdAt: '2025-11-19T09:54:49.430Z',
  filename: '20071445109_e1a2b79633_6k.jpg',
  filesize: 6792756,
  focalX: 55,
  focalY: 38,
  height: 4219,
  id: '691d93e9d438ebb73a571f86',
  mimeType: 'image/jpeg',
  tenant: '691c60693bd37d7912b4feb8',
  thumbnailURL: null,
  updatedAt: '2025-11-19T09:54:49.431Z',
  url: '/api/images/file/20071445109_e1a2b79633_6k.jpg',
  width: 5742,
};

export default meta;

export const ContentImageCentered: StrictStory = {
  args: {
    alignment: 'center',
    blockType: 'imageBlock',
    caption: captionRte1,
    credits: creditsRte1,
    image: imageConfig,
  },
};

export const ContentImageLeftAligned: StrictStory = {
  args: {
    alignment: 'left',
    blockType: 'imageBlock',
    caption: captionRte1,
    credits: creditsRte1,
    image: imageConfig,
  },
};

export const ContentImageRightAligned: StrictStory = {
  args: {
    alignment: 'right',
    blockType: 'imageBlock',
    caption: captionRte1,
    credits: creditsRte1,
    image: imageConfig,
  },
};
