import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PeopleOverview } from '@/components/blocks/PeopleOverview/PeopleOverview';
import { defaultDecorator } from '@/storybook-helpers';

type PeopleOverviewProps = React.ComponentProps<typeof PeopleOverview>;

type StrictStory = StoryObj<typeof PeopleOverview> & {
  args: PeopleOverviewProps;
};

const meta: Meta<typeof PeopleOverview> = {
  args: {},
  component: PeopleOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/PeopleOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
