import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '@/components/Button/Button';
import { defaultDecorator } from '@/storybook-helpers';

const meta: Meta<typeof Button> = {
  args: {
    onClick: fn(),
  },
  component: Button,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
  ],
  title: 'Components/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
    size: 'medium',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
    size: 'medium',
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
