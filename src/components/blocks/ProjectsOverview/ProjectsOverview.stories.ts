import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ProjectsOverview } from '@/components/blocks/ProjectsOverview/ProjectsOverview';
import { defaultDecorator } from '@/storybook-helpers';

type ProjectsOverviewProps = React.ComponentProps<typeof ProjectsOverview>;

type StrictStory = StoryObj<typeof ProjectsOverview> & {
  args: ProjectsOverviewProps;
};

const meta: Meta<typeof ProjectsOverview> = {
  args: {},
  component: ProjectsOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/ProjectsOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
