import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsNewsOverview } from '@/components/base/EventsNewsOverview/EventsNewsOverview';
import { defaultDecorator } from '@/storybook-helpers';
import { NewsListItem } from '@/components/base/NewsListItem/NewsListItem';
import { EventsListItem } from '@/components/base/EventsListItem/EventsListItem';

type EventsNewsOverviewProps = React.ComponentProps<typeof EventsNewsOverview>;

type StrictStory = StoryObj<typeof EventsNewsOverview> & {
  args: EventsNewsOverviewProps;
};

const meta: Meta<typeof EventsNewsOverview> = {
  args: {},
  component: EventsNewsOverview,
  decorators: [defaultDecorator],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/EventsNewsOverview',
};

export default meta;

export const NewsOverview: StrictStory = {
  args: {
    children: Array.from({
      length: 25,
    }, (_, index) => (
      <NewsListItem
        date='17. Mai 2025'
        link='https://foo.bar'
        text='Vier Nachwuchsforschende werden für herausragende Beiträge in Geistes- und Sozialwissenschaften mit dem Early Career Award 2025 ausgezeichnet.'
        title='SAGW verleiht Early Career Award 2025'
        key={`event-${index}`}
      />
    )),
    colorMode: 'white',
    paginationTitle: 'Pagination',
    title: 'News',
  },
};

export const EventsOverview: StrictStory = {
  args: {
    children: Array.from({
      length: 25,
    }, (_, index) => (
      <EventsListItem
        dateStart='2025-10-24T12:00:00.000Z'
        link={{
          href: 'https://foo.bar',
          target: '_self' as const,
        }}
        pageLanguage='de'
        text='SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem'
        key={`event-${index}`}
      />
    )),
    colorMode: 'white',
    paginationTitle: 'Pagination',
    title: 'Events',
  },
};
