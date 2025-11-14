import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverviewComponent } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import { PublicationOverviewFilters } from '@/components/base/FilterList/FilterList.stories';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type PublicationsOverviewProps = React.ComponentProps<typeof PublicationsOverviewComponent>;

type StrictStory = StoryObj<typeof PublicationsOverviewComponent> & {
  args: PublicationsOverviewProps;
};

const meta: Meta<typeof PublicationsOverviewComponent> = {
  args: {},
  component: PublicationsOverviewComponent,
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
  title: 'Components/blocks/PublicationsOverview',
};

export default meta;

const publicationItem = {
  date: '2025-10-23T12:00:00.000Z',
  link: {
    href: 'https://foo.bar',
  },
  pageLanguage: 'de',
  tag: 'Magazin',
  title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
};

export const LotsOfItems: StrictStory = {
  args: {
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    items: Array.from({
      length: 25,
    }, () => publicationItem),
    notification: {
      text: 'Alle Publikationen, die im Jahr 2019 oder früher publiziert wurden, sind auf <a href="https://zenodo.org/communities/sagw/records" target="_blank">Zenodo</a> zu finden.',
      title: '',
    },
    paginationTitle: 'Pagination',
    title: 'Publikationen',
  },
};

export const FewItems: StrictStory = {
  args: {
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    items: Array.from({
      length: 6,
    }, () => publicationItem),
    notification: {
      text: 'Alle Publikationen, die im Jahr 2019 oder früher publiziert wurden, sind auf <a href="https://zenodo.org/communities/sagw/records" target="_blank">Zenodo</a> zu finden.',
      title: '',
    },
    paginationTitle: 'Pagination',
    title: 'Latest News',
  },
};
