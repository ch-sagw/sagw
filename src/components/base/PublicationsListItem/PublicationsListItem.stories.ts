import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsListItem } from '@/components/base/PublicationsListItem/PublicationsListItem';
import { defaultDecorator } from '@/storybook-helpers';
import { PublicationTeaserImage } from '@/components/blocks/helpers/imagesData';

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
    categorization: {},
    date: '2025-10-23T12:00:00.000Z',
    image: PublicationTeaserImage,
    link: {
      href: 'https://foo.bar',
    },
    tag: 'Magazin',
    title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
  },
};

export const NoTag: StrictStory = {
  args: {
    categorization: {},
    date: '2026-04-11T12:00:00.000Z',
    image: PublicationTeaserImage,
    link: {
      href: 'https://foo.bar',
    },
    tag: '',
    title: 'Bulletin 1/25: Intelligenz',
  },
};

