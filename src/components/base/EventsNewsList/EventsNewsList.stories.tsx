import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsNewsList } from '@/components/base/EventsNewsList/EventsNewsList';
import { defaultDecorator } from '@/storybook-helpers';
import { NewsListItem } from '../NewsListItem/NewsListItem';

type EventsNewsListProps = React.ComponentProps<typeof EventsNewsList>;

type StrictStory = StoryObj<typeof EventsNewsList> & {
  args: EventsNewsListProps;
};

const meta: Meta<typeof EventsNewsList> = {
  args: {},
  component: EventsNewsList,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/EventsNewsList',
};

export default meta;

const newsListItem = <NewsListItem
  date='17. Mai 2025'
  link='https://foo.bar'
  text='Vier Nachwuchsforschende werden für herausragende Beiträge in Geistes- und Sozialwissenschaften mit dem Early Career Award 2025 ausgezeichnet.'
  title='SAGW verleiht Early Career Award 2025'
/>;

export const EventsNewsTeaser: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle News',
    },
    children: [newsListItem],
    colorMode: 'light',
    title: 'News',
    type: 'teaser',
  },
};

export const EventsNewsTeaserWithoutLink: StrictStory = {
  args: {
    children: [newsListItem],
    colorMode: 'light',
    title: 'News',
    type: 'teaser',
  },
};

export const EventsNewsOverview: StrictStory = {
  args: {
    children: [newsListItem],
    colorMode: 'white',
    pagination: {
      currentPage: 5,
      onPageChange: (page) => {
        console.log('changed to page', page);
      },
      paginationTitle: 'Pagination',
      totalPages: 10,
    },
    title: 'News',
    type: 'overview',
  },
};
