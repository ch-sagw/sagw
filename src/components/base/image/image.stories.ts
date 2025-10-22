import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { image } from '@/components/base/Image/Image';
import { defaultDecorator } from '@/storybook-helpers';

type ImageProps = React.ComponentProps<typeof image>;

type StrictStory = StoryObj<typeof image> & {
  args: ImageProps;
};

const meta: Meta<typeof image> = {
  args: {},
  component: image,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Image',
};

export default meta;

export const Portrait: StrictStory = {
  args: {
    alt: 'Das Bild zeigt eine junge Frau, mit blonden schulterlangen Haaren und Brille',
    focalPointX: 0.5,
    focalPointY: 1,
    height: 350,
    loading: 'eager',
    performanceMark: 'Portrait',
    src: 'https://sagw-nu.gumlet.io/api/images/file/mbl_1_9417372470_920fe62811_o.jpg',
    variant: 'portrait',
    width: 600,
  },
};
