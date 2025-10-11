import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Rte } from '@/components/blocks/Rte/Rte';
import { defaultDecorator } from '@/storybook-helpers';
import { rte3FullRange } from '@/utilities/rteSampleContent';

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

export const RteStory: StrictStory = {
  args: {
    colorMode: 'white',
    stickyFirstTitle: true,
    text: rte3FullRange,
  },
};
