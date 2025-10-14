import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { image } from '@/components/base/image/image';
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
  title: 'Components/base/image',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
