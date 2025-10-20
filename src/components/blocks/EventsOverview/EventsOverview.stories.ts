import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsOverview } from '@/components/blocks/EventsOverview/EventsOverview';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  DateNotSameMonth, DateNotSameYear, Full, InternalLink, Minimal, MinimalWithoutTag, NoTag,
} from '@/components/base/EventsListItem/EventsListItem.stories';

type EventsOverviewProps = React.ComponentProps<typeof EventsOverview>;

type StrictStory = StoryObj<typeof EventsOverview> & {
  args: EventsOverviewProps;
};

const meta: Meta<typeof EventsOverview> = {
  args: {},
  component: EventsOverview,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/EventsOverview',
};

export default meta;

export const DefaultOverview: StrictStory = {
  args: {
    items: [
      DateNotSameMonth.args,
      DateNotSameYear.args,
      Full.args,
      InternalLink.args,
      Minimal.args,
      MinimalWithoutTag.args,
      NoTag.args,
      DateNotSameMonth.args,
      DateNotSameYear.args,
      Full.args,
    ],
    paginationTitle: 'Pagination',
    title: 'Events',
  },
};
