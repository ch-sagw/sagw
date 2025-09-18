import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Toggle } from '@/components/base/Toggle/Toggle';
import { defaultDecorator } from '@/storybook-helpers';

type ToggleProps = React.ComponentProps<typeof Toggle>;

type StrictStory = StoryObj<typeof Toggle> & {
  args: ToggleProps;
};

const meta: Meta<typeof Toggle> = {
  args: {},
  component: Toggle,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Toggle',
};

export default meta;

export const Checked: StrictStory = {
  args: {
    checked: true,
    labelOff: 'Aus',
    labelOn: 'An',
    name: 'toggle-name',
    value: 'some-toggle',
  },
};

export const Unchecked: StrictStory = {
  args: {
    checked: false,
    labelOff: 'Aus',
    labelOn: 'An',
    name: 'toggle-name',
    value: 'some-toggle',
  },
};
