import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import { fn } from '@storybook/test';
import { __name__ } from './__name__';
import { defaultDecorator } from '@/storybook-helpers';

const meta: Meta<typeof __name__> = {
  args: {
    onClick: fn(),
  },
  component: __name__,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
  ],
  title: 'Components/__name__',
};

export default meta;
type Story = StoryObj<typeof __name__>;

export const Primary: Story = {
  args: {
    size: 'small',
  },
};

export const NoVisualRegressionTesting: Story = {
  args: {
    size: 'large',
  },
  tags: ['!visual:check'],
};
