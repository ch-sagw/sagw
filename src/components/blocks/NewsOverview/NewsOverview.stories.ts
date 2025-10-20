import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NewsOverviewComponent } from '@/components/blocks/NewsOverview/NewsOverview.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type NewsOverviewProps = React.ComponentProps<typeof NewsOverviewComponent>;

type StrictStory = StoryObj<typeof NewsOverviewComponent> & {
  args: NewsOverviewProps;
};

const meta: Meta<typeof NewsOverviewComponent> = {
  args: {},
  component: NewsOverviewComponent,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/NewsOverview',
};

export default meta;

const newsItem = {
  date: '15. Januar 2024',
  link: '/news/breaking-news-important-update',
  text: 'This is a sample news item with some interesting content that would typically be displayed in the news overview.',
  title: 'Breaking News: Important Update',
};

export const LotsOfItems: StrictStory = {
  args: {
    colorMode: 'white',
    items: Array.from({
      length: 25,
    }, () => newsItem),
    paginationTitle: 'Pagination',
    title: 'News',
  },
};

export const FewItems: StrictStory = {
  args: {
    colorMode: 'white',
    items: Array.from({
      length: 6,
    }, () => newsItem),
    paginationTitle: 'Pagination',
    title: 'Latest News',
  },
};
