import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Downloads } from '@/components/blocks/Downloads/Downloads';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { DownloadItem } from '@/components/base/DownloadLinkItem/DownloadLinkItem.stories';

type DownloadsProps = React.ComponentProps<typeof Downloads>;

type StrictStory = StoryObj<typeof Downloads> & {
  args: DownloadsProps;
};

const meta: Meta<typeof Downloads> = {
  args: {},
  component: Downloads,
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
  title: 'Components/blocks/Downloads',
};

export default meta;

export const DownloadsBlock: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle Downloads',
    },
    items: [
      DownloadItem.args,
      DownloadItem.args,
      DownloadItem.args,
    ],
    title: 'Downloads',
  },
};

export const DownloadsBlockWithoutLink: StrictStory = {
  args: {
    items: [
      DownloadItem.args,
      DownloadItem.args,
      DownloadItem.args,
    ],
    title: 'Downloads',
  },
};
