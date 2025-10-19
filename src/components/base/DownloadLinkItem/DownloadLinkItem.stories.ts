import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { DownloadLinkItem } from '@/components/base/DownloadLinkItem/DownloadLinkItem';
import { defaultDecorator } from '@/storybook-helpers';

type DownloadLinkItemProps = React.ComponentProps<typeof DownloadLinkItem>;

type StrictStory = StoryObj<typeof DownloadLinkItem> & {
  args: DownloadLinkItemProps;
};

const meta: Meta<typeof DownloadLinkItem> = {
  args: {},
  component: DownloadLinkItem,
  decorators: [defaultDecorator],
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/DownloadLinkItem',
};

export default meta;

export const LinkItem: StrictStory = {
  args: {
    link: {
      href: 'https://foo.bar',
      target: '_blank',
    },
    pageLanguage: 'de',
    text: 'Offenes Repository für EU-finanzierte Forschungsergebnisse aus Horizon Europe, Euratom und früheren Rahmenprogrammen.',
    title: 'Artikel auf Zenodo',
    type: 'link',
  },
};

export const DownloadItem: StrictStory = {
  args: {
    date: '2025-10-25T12:00:00.000Z',
    format: 'PDF',
    link: {
      href: 'https://foo.bar',
      target: '_blank',
    },
    pageLanguage: 'de',
    size: '248 KB',
    title: 'Reglement über die Gewährung von Reisekostenbeiträgen',
    type: 'download',
  },
};
