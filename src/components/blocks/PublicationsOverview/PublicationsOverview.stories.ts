import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverview } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import { PublicationTeaserImage } from '@/components/blocks/helpers/imagesData';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type PublicationsOverviewProps = React.ComponentProps<typeof PublicationsOverview>;

type StrictStory = StoryObj<typeof PublicationsOverview> & {
  args: PublicationsOverviewProps;
};

const meta: Meta<typeof PublicationsOverview> = {
  args: {},
  component: PublicationsOverview,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'a11y:check',
  ],
  title: 'Components/blocks/PublicationsOverview',
};

export default meta;

const publicationItem = {
  categorization: {},
  date: '2025-10-23T12:00:00.000Z',
  image: PublicationTeaserImage,
  link: {
    href: 'https://foo.bar',
  },
  tag: 'Magazin',
  title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
};

const filterListItems = {
  topics: [
    {
      checked: true,
      label: 'Alle Themen',
      value: 'all',
    },
    {
      checked: false,
      label: 'Bildung',
      value: '693b0993621d28f661711b48',
    },
    {
      checked: false,
      label: 'Demografischer Wandel',
      value: '693b0993621d28f661711b47',
    },
    {
      checked: false,
      label: 'Kultur und Gesellschaft',
      value: '693b0993621d28f661711b46',
    },
    {
      checked: false,
      label: 'Nachhaltigkeit',
      value: '693b0993621d28f661711b49',
    },
    {
      checked: false,
      label: 'Wissenschaftsbetrieb',
      value: '693b0993621d28f661711b45',
    },
  ],
  types: [
    {
      checked: true,
      label: 'Alle Publikationen',
      value: 'all',
    },
    {
      checked: false,
      label: 'Akademiereferate',
      value: '693b0993621d28f661711b4f',
    },
    {
      checked: false,
      label: 'Factsheets',
      value: '693b0993621d28f661711b50',
    },
    {
      checked: false,
      label: 'Jahresbericht',
      value: '693b0993621d28f661711b51',
    },
    {
      checked: false,
      label: 'Magazin',
      value: '693b0993621d28f661711b52',
    },
    {
      checked: false,
      label: 'Studien und Berichte',
      value: '693b0993621d28f661711b53',
    },
  ],
};

export const LotsOfItems: StrictStory = {
  args: {
    colorMode: 'white',
    filterItems: filterListItems,
    paginationTitle: 'Pagination',
    publicationItems: Array.from({
      length: 25,
    }, () => publicationItem),
    title: 'Publikationen',
  },
};

export const FewItems: StrictStory = {
  args: {
    colorMode: 'white',
    filterItems: filterListItems,
    paginationTitle: 'Pagination',
    publicationItems: Array.from({
      length: 25,
    }, () => publicationItem),
    title: 'Latest News',
  },
};
