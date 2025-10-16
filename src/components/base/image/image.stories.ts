import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { image } from '@/components/base/Image/image';
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
    height: 600,
    loading: 'eager',
    performanceMark: 'Portrait',
    priority: true,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    src: './sample-images/csm_Stella_Noack_07d23c066a.jpg',
    variant: 'portrait',
    width: 600,
  },
};
