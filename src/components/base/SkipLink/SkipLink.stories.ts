import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { SkipLink } from '@/components/base/SkipLink/SkipLink';
import { defaultDecorator } from '@/storybook-helpers';

type SkipLinkProps = React.ComponentProps<typeof SkipLink>;

type StrictStory = StoryObj<typeof SkipLink> & {
  args: SkipLinkProps;
};

const meta: Meta<typeof SkipLink> = {
  args: {},
  component: SkipLink,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'a11y:check',
  ],
  title: 'Components/base/SkipLink',
};

export default meta;

export const SkipToMainContent: StrictStory = {
  args: {
    href: '#content',
    label: 'Zum Inhalt',
  },
};
