import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsListItem } from '@/components/base/PublicationsListItem/PublicationsListItem';
import { defaultDecorator } from '@/storybook-helpers';

type PublicationsListItemProps = React.ComponentProps<typeof PublicationsListItem>;

type StrictStory = StoryObj<typeof PublicationsListItem> & {
  args: PublicationsListItemProps;
};

const meta: Meta<typeof PublicationsListItem> = {
  args: {},
  component: PublicationsListItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/PublicationsListItem',
};

export default meta;

export const Full: StrictStory = {
  args: {
    date: '2025-10-23T12:00:00.000Z',
    link: {
      href: 'https://foo.bar',
    },
    pageLanguage: 'de',
    tag: 'Magazin',
    title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
  },
};

export const NoTag: StrictStory = {
  args: {
    date: '2026-04-11T12:00:00.000Z',
    link: {
      href: 'https://foo.bar',
    },
    pageLanguage: 'de',
    tag: '',
    title: 'Bulletin 1/25: Intelligenz',
  },
};

