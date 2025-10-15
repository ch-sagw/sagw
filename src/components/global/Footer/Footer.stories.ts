import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Footer } from '@/components/global/Footer/Footer';
import { defaultDecorator } from '@/storybook-helpers';

type FooterProps = React.ComponentProps<typeof Footer>;

type StrictStory = StoryObj<typeof Footer> & {
  args: FooterProps;
};

const meta: Meta<typeof Footer> = {
  args: {},
  component: Footer,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Footer',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
