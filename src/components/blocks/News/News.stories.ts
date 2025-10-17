import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { News } from '@/components/blocks/News/News';
import { defaultDecorator } from '@/storybook-helpers';

type NewsProps = React.ComponentProps<typeof News>;

type StrictStory = StoryObj<typeof News> & {
  args: NewsProps;
};

const meta: Meta<typeof News> = {
  args: {},
  component: News,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/News',
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

export const NewsTeaser: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle News',
    },
    items,
    title: 'News',
    type: 'teaser',
  },
};

export const NewsTeaserWithoutLink: StrictStory = {
  args: {
    items,
    title: 'News',
    type: 'teaser',
  },
};

export const NewsOverview: StrictStory = {
  args: {
    items: [
      ...items,
      ...items,
      ...items,
      items[0],
    ],
    title: 'News',
    type: 'overview',
  },
};
