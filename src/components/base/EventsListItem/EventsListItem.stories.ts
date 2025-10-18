import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsListItem } from '@/components/base/EventsListItem/EventsListItem';
import { defaultDecorator } from '@/storybook-helpers';

type EventsListItemProps = React.ComponentProps<typeof EventsListItem>;

type StrictStory = StoryObj<typeof EventsListItem> & {
  args: EventsListItemProps;
};

const meta: Meta<typeof EventsListItem> = {
  args: {},
  component: EventsListItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/EventsListItem',
};

export default meta;

export const Full: StrictStory = {
  args: {
    dateEnd: '2025-10-25T12:00:00.000Z',
    dateStart: '2025-10-24T12:00:00.000Z',
    language: 'Auf Deutsch',
    link: {
      href: 'https://foo.bar',
      target: '_blank',
    },
    location: 'ETH Zürich',
    pageLanguage: 'de',
    tag: 'Workshop',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
    time: '18:30 Uhr',
  },
};

export const InternalLink: StrictStory = {
  args: {
    dateEnd: '2025-10-25T12:00:00.000Z',
    dateStart: '2025-10-24T12:00:00.000Z',
    language: 'Auf Deutsch',
    link: {
      href: 'https://foo.bar',
      target: '_self',
    },
    location: 'ETH Zürich',
    pageLanguage: 'de',
    tag: 'Workshop',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
    time: '18:30 Uhr',
  },
};

export const DateNotSameMonth: StrictStory = {
  args: {
    dateEnd: '2025-11-25T12:00:00.000Z',
    dateStart: '2025-10-24T12:00:00.000Z',
    language: 'Auf Deutsch',
    link: {
      href: 'https://foo.bar',
      target: '_self',
    },
    location: 'ETH Zürich',
    pageLanguage: 'de',
    tag: 'Workshop',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
    time: '18:30 Uhr',
  },
};

export const DateNotSameYear: StrictStory = {
  args: {
    dateEnd: '2026-01-25T12:00:00.000Z',
    dateStart: '2025-10-24T12:00:00.000Z',
    language: 'Auf Deutsch',
    link: {
      href: 'https://foo.bar',
      target: '_self',
    },
    location: 'ETH Zürich',
    pageLanguage: 'de',
    tag: 'Workshop',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
    time: '18:30 Uhr',
  },
};

export const NoTag: StrictStory = {
  args: {
    dateEnd: '2025-10-25T12:00:00.000Z',
    dateStart: '2025-10-24T12:00:00.000Z',
    language: 'Auf Deutsch',
    link: {
      href: 'https://foo.bar',
      target: '_self',
    },
    location: 'ETH Zürich',
    pageLanguage: 'de',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
    time: '18:30 Uhr',
  },
};

export const Minimal: StrictStory = {
  args: {
    dateStart: '2025-10-24T12:00:00.000Z',
    link: {
      href: 'https://foo.bar',
      target: '_self',
    },
    pageLanguage: 'de',
    tag: 'Workshop',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  },
};

export const MinimalWithoutTag: StrictStory = {
  args: {
    dateStart: '2025-10-24T12:00:00.000Z',
    link: {
      href: 'https://foo.bar',
      target: '_self',
    },
    pageLanguage: 'de',
    text: 'SSH Energy Workshop 2025: Sozial- und Geisteswissenschaften im Energiesystem',
  },
};
