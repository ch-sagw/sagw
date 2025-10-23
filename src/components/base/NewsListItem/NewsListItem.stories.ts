import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NewsListItem } from '@/components/base/NewsListItem/NewsListItem';
import { defaultDecorator } from '@/storybook-helpers';

type NewsListItemProps = React.ComponentProps<typeof NewsListItem>;

type StrictStory = StoryObj<typeof NewsListItem> & {
  args: NewsListItemProps;
};

const meta: Meta<typeof NewsListItem> = {
  args: {},
  component: NewsListItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/NewsListItem',
};

export default meta;

export const NewsItem: StrictStory = {
  args: {
    date: '17. Mai 2025',
    link: 'https://foo.bar',
    text: 'Vier Nachwuchsforschende werden für herausragende Beiträge in Geistes- und Sozialwissenschaften mit dem Early Career Award 2025 ausgezeichnet.',
    title: 'SAGW verleiht Early Career Award 2025',
  },
};
