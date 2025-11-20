import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { InstitutesOverview } from '@/components/blocks/InstitutesOverview/InstitutesOverview';
import { defaultDecorator } from '@/storybook-helpers';

type InstitutesOverviewProps = React.ComponentProps<typeof InstitutesOverview>;

type StrictStory = StoryObj<typeof InstitutesOverview> & {
  args: InstitutesOverviewProps;
};

const meta: Meta<typeof InstitutesOverview> = {
  args: {},
  component: InstitutesOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/InstitutesOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
