import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { MagazineOverview } from '@/components/blocks/MagazineOverview/MagazineOverview';
import { defaultDecorator } from '@/storybook-helpers';

type MagazineOverviewProps = React.ComponentProps<typeof MagazineOverview>;

type StrictStory = StoryObj<typeof MagazineOverview> & {
  args: MagazineOverviewProps;
};

const meta: Meta<typeof MagazineOverview> = {
  args: {},
  component: MagazineOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/MagazineOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
