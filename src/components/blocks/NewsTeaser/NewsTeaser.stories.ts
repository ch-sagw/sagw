import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NewsTeaserComponent } from '@/components/blocks/NewsTeaser/NewsTeaser.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type NewsTeaserProps = React.ComponentProps<typeof NewsTeaserComponent>;

type StrictStory = StoryObj<typeof NewsTeaserComponent> & {
  args: NewsTeaserProps;
};

const meta: Meta<typeof NewsTeaserComponent> = {
  args: {},
  component: NewsTeaserComponent,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/NewsTeaser',
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

export const DefaultTeaser: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle News',
    },
    colorMode: 'light',
    items,
    title: 'News',
  },
};
