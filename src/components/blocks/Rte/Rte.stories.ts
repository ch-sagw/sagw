import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Rte } from '@/components/blocks/Rte/Rte';
import { defaultDecorator } from '@/storybook-helpers';
import { sampleRte2 } from '@/components/base/Rte/Rte.sampleContent';

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
  title: 'Components/blocks/Rte',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    blockType: 'textBlock',
    text: {
      content: sampleRte2,
    },
  },
};
