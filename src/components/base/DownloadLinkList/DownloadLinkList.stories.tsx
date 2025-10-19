import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { DownloadLinkList } from '@/components/base/DownloadLinkList/DownloadLinkList';
import { defaultDecorator } from '@/storybook-helpers';
import { DownloadLinkItem } from '../DownloadLinkItem/DownloadLinkItem';

type DownloadLinkListProps = React.ComponentProps<typeof DownloadLinkList>;

type StrictStory = StoryObj<typeof DownloadLinkList> & {
  args: DownloadLinkListProps;
};

const meta: Meta<typeof DownloadLinkList> = {
  args: {},
  component: DownloadLinkList,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/DownloadLinkList',
};

export default meta;

const downloadItem = <DownloadLinkItem
  date='2025-10-25T12:00:00.000Z'
  format='PDF'
  link={{
    href: 'https://foo.bar',
    target: '_blank',
  }}
  pageLanguage='de'
  size='248 KB'
  title='Reglement über die Gewährung von Reisekostenbeiträgen'
  type='download'
  key='some-key'
/>;

const linkItem = <DownloadLinkItem
  link={{
    href: 'https://foo.bar',
    target: '_blank',
  }}
  pageLanguage='de'
  text='Offenes Repository für EU-finanzierte Forschungsergebnisse aus Horizon Europe, Euratom und früheren Rahmenprogrammen.'
  title='Artikel auf Zenodo'
  type='link'
/>;

export const DownloadList: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle Downloads',
    },
    children: [downloadItem],
    title: 'Downloads',
    type: 'download',
  },
};

export const DownloadListWithoutLink: StrictStory = {
  args: {
    children: [downloadItem],
    title: 'Downloads',
    type: 'download',
  },
};

export const LinkList: StrictStory = {
  args: {
    children: [linkItem],
    title: 'Links',
    type: 'link',
  },
};
