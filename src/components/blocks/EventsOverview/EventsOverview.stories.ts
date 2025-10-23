import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsOverviewComponent } from '@/components/blocks/EventsOverview/EventsOverview.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type EventsOverviewProps = React.ComponentProps<typeof EventsOverviewComponent>;

type StrictStory = StoryObj<typeof EventsOverviewComponent> & {
  args: EventsOverviewProps;
};

const meta: Meta<typeof EventsOverviewComponent> = {
  args: {},
  component: EventsOverviewComponent,
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
  title: 'Components/blocks/EventsOverview',
};

export default meta;

const Full = {
  dateEnd: '2025-10-25T12:00:00.000Z',
  dateStart: '2025-10-24T12:00:00.000Z',
  language: 'Auf Deutsch',
  link: {
    href: 'https://foo.bar',
    target: '_blank' as const,
  },
  location: 'ETH Zürich',
  pageLanguage: 'de',
  tag: 'Workshop',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  time: '18:30 Uhr',
};

const InternalLink = {
  dateEnd: '2025-10-25T12:00:00.000Z',
  dateStart: '2025-10-24T12:00:00.000Z',
  language: 'Auf Deutsch',
  link: {
    href: 'https://foo.bar',
    target: '_self' as const,
  },
  location: 'ETH Zürich',
  pageLanguage: 'de',
  tag: 'Workshop',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  time: '18:30 Uhr',
};

const DateNotSameMonth = {
  dateEnd: '2025-11-25T12:00:00.000Z',
  dateStart: '2025-10-24T12:00:00.000Z',
  language: 'Auf Deutsch',
  link: {
    href: 'https://foo.bar',
    target: '_self' as const,
  },
  location: 'ETH Zürich',
  pageLanguage: 'de',
  tag: 'Workshop',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  time: '18:30 Uhr',
};

const DateNotSameYear = {
  dateEnd: '2026-01-25T12:00:00.000Z',
  dateStart: '2025-10-24T12:00:00.000Z',
  language: 'Auf Deutsch',
  link: {
    href: 'https://foo.bar',
    target: '_self' as const,
  },
  location: 'ETH Zürich',
  pageLanguage: 'de',
  tag: 'Workshop',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  time: '18:30 Uhr',
};

const NoTag = {
  dateEnd: '2025-10-25T12:00:00.000Z',
  dateStart: '2025-10-24T12:00:00.000Z',
  language: 'Auf Deutsch',
  link: {
    href: 'https://foo.bar',
    target: '_self' as const,
  },
  location: 'ETH Zürich',
  pageLanguage: 'de',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  time: '18:30 Uhr',
};

const Minimal = {
  dateStart: '2025-10-24T12:00:00.000Z',
  link: {
    href: 'https://foo.bar',
    target: '_self' as const,
  },
  pageLanguage: 'de',
  tag: 'Workshop',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
};

const MinimalWithoutTag = {
  dateStart: '2025-10-24T12:00:00.000Z',
  link: {
    href: 'https://foo.bar',
    target: '_self' as const,
  },
  pageLanguage: 'de',
  text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
};

export const LotsOfItems: StrictStory = {
  args: {
    colorMode: 'white',
    items: [
      Full,
      InternalLink,
      DateNotSameMonth,
      DateNotSameYear,
      NoTag,
      Minimal,
      MinimalWithoutTag,
      Full,
      InternalLink,
      DateNotSameMonth,
      DateNotSameYear,
      NoTag,
      Minimal,
      MinimalWithoutTag,
      Full,
      InternalLink,
      DateNotSameMonth,
      DateNotSameYear,
      NoTag,
      Minimal,
      MinimalWithoutTag,
    ],
    paginationTitle: 'Pagination',
    title: 'News',
  },
};

export const FewItems: StrictStory = {
  args: {
    colorMode: 'white',
    items: [
      Full,
      InternalLink,
      DateNotSameMonth,
      DateNotSameYear,
      NoTag,
      Minimal,
      MinimalWithoutTag,
    ],
    paginationTitle: 'Pagination',
    title: 'Latest News',
  },
};
