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
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 450,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'content',
    width: 800,
  },
};

export const ContentImageWide: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 450,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'content',
    width: 800,
  },
};

export const GenericTeaser: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 300,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'genericTeaser',
    width: 400,
  },
};

export const LogoTeaser: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 100,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'logoTeaser',
    width: 100,
  },
};

export const MagazineHero: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 675,
    loading: 'eager',
    performanceMark: 'magazine-hero-teaser',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'hero',
    width: 1200,
  },
};

export const Portrait: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 400,
    loading: 'eager',
    performanceMark: 'portrait',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'portrait',
    width: 400,
  },
};

export const PortraitCta: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 200,
    loading: 'lazy',
    performanceMark: 'Portrait',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'portraitCta',
    width: 200,
  },
};

export const PublicationTeaser: StrictStory = {
  args: {
    alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger.',
    focalPointX: 0.5,
    focalPointY: 0.45,
    height: 114,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/20071445109_e1a2b79633_6k.jpg',
    variant: 'publicationTeaser',
    width: 80,
  },
};
