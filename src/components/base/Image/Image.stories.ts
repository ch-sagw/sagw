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
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 450,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'content',
    width: 800,
  },
};

export const ContentImageWide: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 450,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'content',
    width: 800,
  },
};

export const GenericTeaser: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 450,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'genericTeaser',
    width: 600,
  },
};

export const LogoTeaser: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 100,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'logoTeaser',
    width: 100,
  },
};

export const MagazineHero: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 675,
    loading: 'eager',
    performanceMark: 'magazine-hero-teaser',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'hero',
    width: 1200,
  },
};

export const Portrait: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 600,
    loading: 'eager',
    performanceMark: 'portrait',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'portrait',
    width: 600,
  },
};

export const PortraitCta: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 200,
    loading: 'lazy',
    performanceMark: 'Portrait',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'portraitCta',
    width: 200,
  },
};

export const PublicationTeaser: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 0.5,
    height: 114,
    loading: 'lazy',
    performanceMark: '',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'publicationTeaser',
    width: 80,
  },
};
