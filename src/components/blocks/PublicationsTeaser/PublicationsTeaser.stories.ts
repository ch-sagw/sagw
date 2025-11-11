import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsTeaser } from '@/components/blocks/PublicationsTeaser/PublicationsTeaser';
import { defaultDecorator } from '@/storybook-helpers';

type PublicationsTeaserProps = React.ComponentProps<typeof PublicationsTeaser>;

type StrictStory = StoryObj<typeof PublicationsTeaser> & {
  args: PublicationsTeaserProps;
};

const meta: Meta<typeof PublicationsTeaser> = {
  args: {},
  component: PublicationsTeaser,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/PublicationsTeaser',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
