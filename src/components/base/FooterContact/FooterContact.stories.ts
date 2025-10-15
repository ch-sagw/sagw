import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FooterContact } from '@/components/base/FooterContact/FooterContact';
import { defaultDecorator } from '@/storybook-helpers';

type FooterContactProps = React.ComponentProps<typeof FooterContact>;

type StrictStory = StoryObj<typeof FooterContact> & {
  args: FooterContactProps;
};

const meta: Meta<typeof FooterContact> = {
  args: {},
  component: FooterContact,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Footer/FooterContact',
};

export default meta;

export const SampleStory: StrictStory = {
  args: {
    context: 'sampleContext',
    sampleProperty: 'some text',
  },
};
