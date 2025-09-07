import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Rte } from '@/components/base/Rte/Rte';
import { defaultDecorator } from '@/storybook-helpers';
import {
  sampleRte1, sampleRte2,
} from '@/components/base/Rte/Rte.sampleContent';

const meta: Meta<typeof Rte> = {
  args: {},
  component: Rte,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/Base/Rte',
};

export default meta;
type Story = StoryObj<typeof Rte>;

export const SampleRte1: Story = {
  args: {
    text: sampleRte1,
  },
};

export const SampleRte2: Story = {
  args: {
    text: sampleRte2,
  },
};
