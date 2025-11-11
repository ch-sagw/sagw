import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationTeaserItem } from '@/components/base/PublicationTeaserItem/PublicationTeaserItem';
import { defaultDecorator } from '@/storybook-helpers';

type PublicationTeaserItemProps = React.ComponentProps<typeof PublicationTeaserItem>;

type StrictStory = StoryObj<typeof PublicationTeaserItem> & {
  args: PublicationTeaserItemProps;
};

const meta: Meta<typeof PublicationTeaserItem> = {
  args: {},
  component: PublicationTeaserItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/PublicationTeaserItem',
};

export default meta;

export const Full: StrictStory = {
  args: {
    date: '2025-10-23T12:00:00.000Z',
    image: '',
    link: {
      href: 'https://foo.bar',
    },
    pageLanguage: 'de',
    tag: 'Magazin',
    text: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
  },
};

export const NoTag: StrictStory = {
  args: {
    date: '2026-04-11T12:00:00.000Z',
    image: '',
    link: {
      href: 'https://foo.bar',
    },
    pageLanguage: 'de',
    tag: '',
    text: 'Bulletin 1/25: Intelligenz',
  },
};

