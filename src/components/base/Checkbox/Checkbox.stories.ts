import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Checkbox } from '@/components/base/Checkbox/Checkbox';
import { defaultDecorator } from '@/storybook-helpers';

type CheckboxProps = React.ComponentProps<typeof Checkbox>;

type StrictStory = StoryObj<typeof Checkbox> & {
  args: CheckboxProps;
};

const meta: Meta<typeof Checkbox> = {
  args: {},
  component: Checkbox,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Checkbox',
};

export default meta;

export const DefaultCheckbox: StrictStory = {
  args: {
    checked: false,
    colorTheme: 'light',
    errorText: '',
    label: 'Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.',
    name: 'name',
    value: 'value',
  },
};

export const CheckedCheckbox: StrictStory = {
  args: {
    checked: true,
    colorTheme: 'light',
    errorText: '',
    label: 'Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.',
    name: 'name',
    value: 'value',
  },
};

export const CheckboxWithError: StrictStory = {
  args: {
    checked: false,
    colorTheme: 'light',
    errorText: 'Bitte akzeptieren sie die Hinweise zum Datenschutz.',
    label: 'Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.',
    name: 'name',
    value: 'value',
  },
};

export const DarkVariant: StrictStory = {
  args: {
    checked: false,
    colorTheme: 'dark',
    errorText: 'Bitte akzeptieren sie die Hinweise zum Datenschutz.',
    label: 'Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.',
    name: 'name',
    value: 'value',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },

  // TODO: color contrast not sufficient!
  tags: ['!a11y:check'],
};
