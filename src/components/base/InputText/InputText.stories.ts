import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { InputText } from '@/components/base/InputText/InputText';
import { defaultDecorator } from '@/storybook-helpers';

type InputTextProps = React.ComponentProps<typeof InputText>;

type StrictStory = StoryObj<typeof InputText> & {
  args: InputTextProps;
};

const meta: Meta<typeof InputText> = {
  args: {},
  component: InputText,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/InputText',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    defaultValue: '',
    errorText: 'Bitte geben Sie ihren Namen an.',
    id: 'someId',
    label: 'Name',
    name: 'name',
    placeholder: 'Ihr Name',
    required: true,
  },
};
