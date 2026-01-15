import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { SkipLinks } from '@/components/global/SkipLinks/SkipLinks';
import { defaultDecorator } from '@/storybook-helpers';

type SkipLinksProps = React.ComponentProps<typeof SkipLinks>;

type StrictStory = StoryObj<typeof SkipLinks> & {
  args: SkipLinksProps;
};

const meta: Meta<typeof SkipLinks> = {
  args: {},
  component: SkipLinks,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: ['autodocs'],
  title: 'Components/global/SkipLinks',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {},
};
