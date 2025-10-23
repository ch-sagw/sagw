import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { TeaserLinkList } from '@/components/base/TeaserLinkList/TeaserLinkList';
import { defaultDecorator } from '@/storybook-helpers';
import { NewsListItem } from '@/components/base/NewsListItem/NewsListItem';
import { EventsListItem } from '@/components/base/EventsListItem/EventsListItem';
import { DownloadLinkItem } from '@/components/base/DownloadLinkItem/DownloadLinkItem';

type TeaserLinkListProps = React.ComponentProps<typeof TeaserLinkList>;

type StrictStory = StoryObj<typeof TeaserLinkList> & {
  args: TeaserLinkListProps;
};

const newsListItem = <NewsListItem
  date='17. Mai 2025'
  link='https://foo.bar'
  text='Vier Nachwuchsforschende werden für herausragende Beiträge in Geistes- und Sozialwissenschaften mit dem Early Career Award 2025 ausgezeichnet.'
  title='SAGW verleiht Early Career Award 2025'
  key='some-key'
/>;

const eventListItem = <EventsListItem
  dateStart='2025-10-24T12:00:00.000Z'
  link={{
    href: 'https://foo.bar',
    target: '_self' as const,
  }}
  pageLanguage='de'
  text='SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem'
  key='some-key'
/>;

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
  text='Offenes Repository für EU-finanzierte Forschungsergebnisse aus Horizon Europe, Euratom und früheren Rahmenprogrammen.'
  title='Artikel auf Zenodo'
  type='link'
  key='some-key'
/>;

const meta: Meta<typeof TeaserLinkList> = {
  args: {},
  component: TeaserLinkList,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/TeaserLinkList',
};

export default meta;

export const NewsTeaser: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle News',
    },
    children: [
      newsListItem,
      newsListItem,
      newsListItem,
    ],
    colorMode: 'light',
    title: 'News',
  },
};

export const EventsTeaser: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle News',
    },
    children: [
      eventListItem,
      eventListItem,
      eventListItem,
    ],
    colorMode: 'white',
    title: 'Events',
  },
};

export const DownloadList: StrictStory = {
  args: {
    children: [
      downloadItem,
      downloadItem,
      downloadItem,
    ],
    colorMode: 'light',
    subtitle: 'Dieser Artikel ist Teil von folgender Bulletin-Ausgabe',
    title: 'Downloads',
  },
};

export const LinkList: StrictStory = {
  args: {
    children: [
      linkItem,
      linkItem,
      linkItem,
    ],
    colorMode: 'light',
    title: 'Links',
  },
};
