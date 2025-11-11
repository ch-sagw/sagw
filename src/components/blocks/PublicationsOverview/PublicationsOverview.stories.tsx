import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverview } from '@/components/blocks/PublicationsOverview/PublicationsOverview';
import { PublicationTeaserItem } from '@/components/base/PublicationTeaserItem/PublicationTeaserItem';
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

export const Overview: StrictStory = {
  args: {
    children: Array.from({
      length: 25,
    }, (_, index) => (
      <PublicationTeaserItem
        date='2025-10-24T12:00:00.000Z'
        image=''
        key={`event-${index}`}
        link={{
          href: 'https://foo.bar',
        }}
        pageLanguage='de'
        tag='Bulletin'
        text='Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie'
      />
    )),
    colorMode: 'white',
    paginationTitle: 'Pagination',
    title: 'Publikationen',
  },
};
