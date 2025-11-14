import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverview } from '@/components/base/PublicationsOverview/PublicationsOverview';
import { PublicationsListItem } from '@/components/base/PublicationsListItem/PublicationsListItem';
import { PublicationOverviewFilters } from '@/components/base/FilterList/FilterList.stories';
import { defaultDecorator } from '@/storybook-helpers';

type PublicationsOverviewProps = React.ComponentProps<typeof PublicationsOverview>;

type StrictStory = StoryObj<typeof PublicationsOverview> & {
  args: PublicationsOverviewProps;
};

const meta: Meta<typeof PublicationsOverview> = {
  args: {},
  component: PublicationsOverview,
  decorators: [defaultDecorator],
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
  title: 'Components/base/PublicationsOverview',
};

export default meta;

export const Publications: StrictStory = {
  args: {
    children: Array.from({
      length: 25,
    }, (_, index) => (
      <PublicationsListItem
        date='2025-10-23T12:00:00.000Z'
        link={{
          href: 'https://foo.bar',
        }}
        key={`publication-${index}`}
        pageLanguage='de'
        tag='Magazin'
        title='Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie'
      />
    )),
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    notification: {
      text: 'Alle Publikationen, die im Jahr 2019 oder früher publiziert wurden, sind auf <a href="https://zenodo.org/communities/sagw/records" target="_blank">Zenodo</a> zu finden.',
      title: '',
    },
    paginationTitle: 'Pagination',
    title: 'Publikationen',
  },
};

export const PublicationsNoNotification: StrictStory = {
  args: {
    children: Array.from({
      length: 25,
    }, (_, index) => (
      <PublicationsListItem
        date='2025-10-23T12:00:00.000Z'
        link={{
          href: 'https://foo.bar',
        }}
        key={`publication-${index}`}
        pageLanguage='de'
        tag='Magazin'
        title='Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie'
      />
    )),
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    paginationTitle: 'Pagination',
    title: 'Publikationen',
  },
};

