import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EditionsOverview } from '@/components/blocks/EditionsOverview/EditionsOverview';
import { defaultDecorator } from '@/storybook-helpers';

type EditionsOverviewProps = React.ComponentProps<typeof EditionsOverview>;

type StrictStory = StoryObj<typeof EditionsOverview> & {
  args: EditionsOverviewProps;
};

const meta: Meta<typeof EditionsOverview> = {
  args: {},
  component: EditionsOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/EditionsOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
