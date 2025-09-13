import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Form } from '@/components/blocks/Form/Form';
import { defaultDecorator } from '@/storybook-helpers';

type FormProps = React.ComponentProps<typeof Form>;

type StrictStory = StoryObj<typeof Form> & {
  args: FormProps;
};

const meta: Meta<typeof Form> = {
  args: {},
  component: Form,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Form',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
