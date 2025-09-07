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

export const Rte1HeroLead: Story = {
  args: {
    context: 'heroLead',
    rteConfig: 'rte1',
    text: sampleRte1,
  },
};

export const Rte1MagazineDetailLead: Story = {
  args: {
    context: 'magazineDetailLead',
    rteConfig: 'rte1',
    text: sampleRte1,
  },
};

export const Rte2Notification: Story = {
  args: {
    context: 'notification',
    rteConfig: 'rte2',
    text: sampleRte2,
  },
};

export const Rte2MagazineDetailText: Story = {
  args: {
    context: 'magazineDetailText',
    rteConfig: 'rte2',
    text: sampleRte2,
  },
};
