import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsNewsTeaser } from '@/components/base/EventsNewsTeaser/EventsNewsTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import { NewsListItem } from '@/components/base/NewsListItem/NewsListItem';
import { EventsListItem } from '@/components/base/EventsListItem/EventsListItem';

type EventsNewsTeaserProps = React.ComponentProps<typeof EventsNewsTeaser>;

type StrictStory = StoryObj<typeof EventsNewsTeaser> & {
  args: EventsNewsTeaserProps;
};

const meta: Meta<typeof EventsNewsTeaser> = {
  args: {},
  component: EventsNewsTeaser,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/EventsNewsTeaser',
};

export default meta;

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

export const NewsTeaserWithoutLink: StrictStory = {
  args: {
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
