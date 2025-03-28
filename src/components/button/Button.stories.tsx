import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { defaultDecorator } from '@/storybook-helpers';

const meta: Meta<typeof Button> = {
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
  args: {
    onClick: fn(),
  },
  component: Button,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */},
  tags: [
    'autodocs',
    'visual:check',
  ],
  title: 'Components/Button',
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'large',
  },
  tags: ['!visual:check'],
};

export const Small: Story = {
  args: {
    label: 'Button',
    size: 'small',
  },
};
