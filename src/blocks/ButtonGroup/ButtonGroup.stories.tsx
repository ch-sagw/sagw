import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import { ButtonGroup } from '@/blocks/ButtonGroup/Component';
import { defaultDecorator } from '@/storybook-helpers';

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
  decorators: [defaultDecorator],
  tags: [
    'autodocs',
    'visual:check',
  ],
  title: 'Blocks/ButtonGroup',
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const MixedButtonGroup: Story = {
  args: {
    buttons: [
      {
        button: {
          label: 'First Button',
          primary: false,
          size: 'medium',
        },
      },
      {
        button: {
          label: 'Second Button',
          primary: true,
          size: 'medium',
        },
      },
      {
        button: {
          label: 'Third Button',
          primary: false,
          size: 'medium',
        },
      },
    ],
  },
};

