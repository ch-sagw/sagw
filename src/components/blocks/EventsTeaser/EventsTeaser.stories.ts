import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsTeaser } from '@/components/blocks/EventsTeaser/EventsTeaser';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  DateNotSameMonth, DateNotSameYear, Full,
} from '@/components/base/EventsListItem/EventsListItem.stories';

type EventsTeaserProps = React.ComponentProps<typeof EventsTeaser>;

type StrictStory = StoryObj<typeof EventsTeaser> & {
  args: EventsTeaserProps;
};

const meta: Meta<typeof EventsTeaser> = {
  args: {},
  component: EventsTeaser,
  decorators: [defaultDecoratorNoPadding],
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/EventsTeaser',
};

export default meta;

export const DefaultTeaser: StrictStory = {
  args: {
    allLink: {
      href: 'https://foo.bar',
      text: 'Alle Events',
    },
    items: [
      DateNotSameMonth.args,
      DateNotSameYear.args,
      Full.args,
    ],
    title: 'Events',
  },
};
