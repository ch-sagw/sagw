import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericOverview } from '@/components/base/GenericOverview/GenericOverview';
import { defaultDecorator } from '@/storybook-helpers';

type GenericOverviewProps = React.ComponentProps<typeof GenericOverview>;

type StrictStory = StoryObj<typeof GenericOverview> & {
  args: GenericOverviewProps;
};

const meta: Meta<typeof GenericOverview> = {
  args: {},
  component: GenericOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/GenericOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
