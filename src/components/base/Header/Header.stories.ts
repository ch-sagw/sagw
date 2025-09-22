import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Header } from '@/components/base/Header/Header';
import { defaultDecorator } from '@/storybook-helpers';

type HeaderProps = React.ComponentProps<typeof Header>;

type StrictStory = StoryObj<typeof Header> & {
  args: HeaderProps;
};

const meta: Meta<typeof Header> = {
  args: {},
  component: Header,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Header',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
