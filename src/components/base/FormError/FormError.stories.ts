import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FormError } from '@/components/base/FormError/FormError';
import { defaultDecorator } from '@/storybook-helpers';

type FormErrorProps = React.ComponentProps<typeof FormError>;

type StrictStory = StoryObj<typeof FormError> & {
  args: FormErrorProps;
};

const meta: Meta<typeof FormError> = {
  args: {},
  component: FormError,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/FormError',
};

export default meta;

export const White: StrictStory = {
  args: {
    colorMode: 'white',
    errorId: 'some-id',
    errorText: 'Some random error text for a form field error.',

  },
};

export const Light: StrictStory = {
  args: {
    colorMode: 'light',
    errorId: 'some-id',
    errorText: 'Some random error text for a form field error.',

  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const Dark: StrictStory = {
  args: {
    colorMode: 'dark',
    errorId: 'some-id',
    errorText: 'Some random error text for a form field error.',

  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
