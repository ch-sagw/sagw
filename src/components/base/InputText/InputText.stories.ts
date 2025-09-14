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

export const Text: StrictStory = {
  args: {
    colorScheme: 'bright',
    defaultValue: '',
    errorText: '',
    label: 'Text input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'text',
  },
};

export const Email: StrictStory = {
  args: {
    // colorScheme: 'bright',
    defaultValue: '',
    errorText: '',
    label: 'Email input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'email',
  },
};

export const WithError: StrictStory = {
  args: {
    colorScheme: 'bright',
    defaultValue: '',
    errorText: 'Bitte geben Sie eine korrekte E-Mail Adresse an.',
    label: 'Email input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'email',
  },
};

export const WithDefaultValue: StrictStory = {
  args: {
    colorScheme: 'bright',
    defaultValue: 'Default Value',
    errorText: '',
    label: 'Email input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'email',
  },
};
