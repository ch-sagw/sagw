import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Rte } from '@/components/base/Rte/Rte';
import { defaultDecorator } from '@/storybook-helpers';
import {
  sampleRte1, sampleRte2,
} from '@/components/base/Rte/Rte.sampleContent';

type RteProps = React.ComponentProps<typeof Rte>;

type StrictStory = StoryObj<typeof Rte> & {
  args: RteProps;
};

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
  title: 'Components/base/Rte',
};

export default meta;

export const Rte1HeroLead: StrictStory = {
  args: {
    context: 'heroLead',
    rteConfig: 'rte1',
    text: sampleRte1,
  },
};

export const Rte1MagazineDetailLead: StrictStory = {
  args: {
    context: 'magazineDetailLead',
    rteConfig: 'rte1',
    text: sampleRte1,
  },
};

export const Rte2Notification: StrictStory = {
  args: {
    context: 'notification',
    rteConfig: 'rte2',
    text: sampleRte2,
  },
};

export const Rte2MagazineDetailText: StrictStory = {
  args: {
    context: 'magazineDetailText',
    rteConfig: 'rte2',
    text: sampleRte2,
  },
};
