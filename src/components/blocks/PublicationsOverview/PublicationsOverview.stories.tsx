import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverview } from '@/components/blocks/PublicationsOverview/PublicationsOverview';
import { PublicationsListItem } from '@/components/base/PublicationsListItem/PublicationsListItem';
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
      <PublicationsListItem
        date='2025-10-24T12:00:00.000Z'
        key={`event-${index}`}
        link={{
          href: 'https://foo.bar',
        }}
        pageLanguage='de'
        tag='Bulletin'
        title='Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie'
      />
    )),
  },
};
