import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Links } from '@/components/blocks/Links/Links';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { LinkItem } from '@/components/base/DownloadLinkItem/DownloadLinkItem.stories';

type LinksProps = React.ComponentProps<typeof Links>;

type StrictStory = StoryObj<typeof Links> & {
  args: LinksProps;
};

const meta: Meta<typeof Links> = {
  args: {},
  component: Links,
  decorators: [defaultDecoratorNoPadding],
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Links',
};

export default meta;

export const LinksBlock: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle Links',
    },
    items: [
      LinkItem.args,
      LinkItem.args,
      LinkItem.args,
    ],
    title: 'Links',
  },
};
