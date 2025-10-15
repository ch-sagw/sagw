import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { SocialLinks } from '@/components/base/SocialLinks/SocialLinks';
import { defaultDecorator } from '@/storybook-helpers';

type SocialLinksProps = React.ComponentProps<typeof SocialLinks>;

type StrictStory = StoryObj<typeof SocialLinks> & {
  args: SocialLinksProps;
};

const meta: Meta<typeof SocialLinks> = {
  args: {},
  component: SocialLinks,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Footer/SocialLinks',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
