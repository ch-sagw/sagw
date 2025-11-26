import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Image } from '@/components/base/Image/Image';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type ImageProps = React.ComponentProps<typeof Image>;

type StrictStory = StoryObj<typeof Image> & {
  args: ImageProps;
};

const defaultArgs: ImageProps = {
  alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
  filename: '20071445109_e1a2b79633_6k.jpg',
  focalX: 50,
  focalY: 45,
  height: 450,
  loading: 'lazy',
  performanceMark: '',
  url: '/api/images/file/20071445109_e1a2b79633_6k.jpg',
  variant: 'content',
  width: 800,
};

const meta: Meta<typeof Image> = {
  args: {},
  component: Image,
  decorators: [defaultDecoratorNoPadding],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Image',
};

export default meta;

export const ContentImage: StrictStory = {
  args: {
    ...defaultArgs,
  },
};

export const ContentImageFull: StrictStory = {
  args: {
    ...defaultArgs,
    height: 450,
    variant: 'contentFull',
    width: 800,
  },
};

export const GenericTeaser: StrictStory = {
  args: {
    ...defaultArgs,
    height: 300,
    variant: 'genericTeaser',
    width: 400,
  },
};

export const LogoTeaser: StrictStory = {
  args: {
    ...defaultArgs,
    height: 100,
    variant: 'logoTeaser',
    width: 100,
  },
};

export const MagazineHero: StrictStory = {
  args: {
    ...defaultArgs,
    height: 675,
    loading: 'eager',
    performanceMark: 'magazine-hero-teaser',
    variant: 'hero',
    width: 1200,
  },
};

export const Portrait: StrictStory = {
  args: {
    ...defaultArgs,
    height: 400,
    loading: 'eager',
    variant: 'portrait',
    width: 400,
  },
};

export const PortraitCta: StrictStory = {
  args: {
    ...defaultArgs,
    height: 200,
    variant: 'portraitCta',
    width: 200,
  },
};

export const PublicationTeaser: StrictStory = {
  args: {
    ...defaultArgs,
    height: 114,
    variant: 'publicationTeaser',
    width: 80,
  },
};
