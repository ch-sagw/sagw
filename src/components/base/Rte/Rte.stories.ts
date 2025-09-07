import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Rte } from '@/components/base/Rte/Rte';
import { defaultDecorator } from '@/storybook-helpers';
import { sampleRteText } from '@/components/base/Rte/Rte.sampleContent';

const meta: Meta<typeof Rte> = {
  args: {},
  component: Rte,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
  ],
  title: 'Components/Blocks/Rte',
};

export default meta;
type Story = StoryObj<typeof Rte>;

export const SampleRte: Story = {
  args: {
    text: sampleRteText,
  },
};

