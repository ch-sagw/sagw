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
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
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
    colorMode: 'white',
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
    colorMode: 'white',
    defaultValue: '',
    errorText: '',
    label: 'Email input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'email',
  },
};

export const Textarea: StrictStory = {
  args: {
    colorMode: 'white',
    defaultValue: '',
    errorText: '',
    label: 'Textarea',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'textarea',
  },
};

export const WithError: StrictStory = {
  args: {
    colorMode: 'white',
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
    colorMode: 'white',
    defaultValue: 'Default Value',
    errorText: '',
    label: 'Email input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'email',
  },
};

export const DarkVariant: StrictStory = {
  args: {
    colorMode: 'dark',
    defaultValue: 'Default Value',
    errorText: 'Bitte geben Sie eine korrekte E-Mail Adresse an.',
    label: 'Email input field',
    name: 'name',
    placeholder: 'Placeholder text',
    required: true,
    type: 'email',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },

  // TODO: color contrast not sufficient!
  tags: ['!a11y:check'],
};
