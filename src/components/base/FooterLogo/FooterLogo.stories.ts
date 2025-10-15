import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FooterLogo } from '@/components/base/FooterLogo/FooterLogo';
import { defaultDecorator } from '@/storybook-helpers';

type FooterLogoProps = React.ComponentProps<typeof FooterLogo>;

type StrictStory = StoryObj<typeof FooterLogo> & {
  args: FooterLogoProps;
};

const meta: Meta<typeof FooterLogo> = {
  args: {},
  component: FooterLogo,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/FooterLogo',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
