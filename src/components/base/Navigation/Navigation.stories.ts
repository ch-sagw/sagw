import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Navigation } from '@/components/base/Navigation/Navigation';
import { defaultDecorator } from '@/storybook-helpers';

type NavigationProps = React.ComponentProps<typeof Navigation>;

type StrictStory = StoryObj<typeof Navigation> & {
  args: NavigationProps;
};

const meta: Meta<typeof Navigation> = {
  args: {},
  component: Navigation,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Navigation',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
