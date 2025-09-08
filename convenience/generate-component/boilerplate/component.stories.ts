import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { __name__ } from '@/components/__componentFolder__/__name__/__name__';
import { defaultDecorator } from '@/storybook-helpers';

type __name__Props = React.ComponentProps<typeof __name__>;

type StrictStory = StoryObj<typeof __name__> & {
  args: __name__Props;
};

const meta: Meta<typeof __name__> = {
  args: {},
  component: __name__,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/__componentFolder__/__name__',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
