import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NewsOverview } from '@/components/blocks/NewsOverview/NewsOverview';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type NewsOverviewProps = React.ComponentProps<typeof NewsOverview>;

type StrictStory = StoryObj<typeof NewsOverview> & {
  args: NewsOverviewProps;
};

const meta: Meta<typeof NewsOverview> = {
  args: {},
  component: NewsOverview,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/NewsOverview',
};

export default meta;

const items = [
  {
    date: '17. Mai 2025',
    link: 'https://foo.bar',
    text: 'Vier Nachwuchsforschende werden für herausragende Beiträge in Geistes- und Sozialwissenschaften mit dem Early Career Award 2025 ausgezeichnet.',
    title: 'SAGW verleiht Early Career Award 2025',
  },
  {
    date: '17. Mai 2025',
    link: 'https://foo.bar',
    text: 'Die SAGW lud zum strategischen Dialog über die Zukunft der Geistes- und Sozialwissenschaften.',
    title: 'SAGW startet strategischen Dialog zur Zukunft der Geistes- und Sozialwissenschaften',
  },
  {
    date: '17. Mai 2025',
    link: 'https://foo.bar',
    text: 'In einem offenen Brief fordern die Akademien, den Wissenschaftsjournalismus beim SRF zu stärken und dessen Eigenständigkeit zu sichern.',
    title: 'Akademien setzen sich für Wissenschaftsjournalismus beim SRF ein',
  },
];

export const DefaultOverview: StrictStory = {
  args: {
    items: [
      ...items,
      ...items,
      ...items,
      items[0],
    ],
    pagination: {
      currentPage: 5,
      onPageChange: (page) => {
        console.log('changed to page', page);
      },
      paginationTitle: 'Pagination',
      totalPages: 10,
    },
    title: 'News',
  },
};
