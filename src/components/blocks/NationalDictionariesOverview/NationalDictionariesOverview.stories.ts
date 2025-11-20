import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NationalDictionariesOverview } from '@/components/blocks/NationalDictionariesOverview/NationalDictionariesOverview';
import { defaultDecorator } from '@/storybook-helpers';

type NationalDictionariesOverviewProps = React.ComponentProps<typeof NationalDictionariesOverview>;

type StrictStory = StoryObj<typeof NationalDictionariesOverview> & {
  args: NationalDictionariesOverviewProps;
};

const meta: Meta<typeof NationalDictionariesOverview> = {
  args: {},
  component: NationalDictionariesOverview,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/NationalDictionariesOverview',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
