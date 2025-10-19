import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { EventsTeaserComponent } from '@/components/blocks/EventsTeaser/EventsTeaser.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  DateNotSameMonth, DateNotSameYear, Full,
} from '@/components/base/EventsListItem/EventsListItem.stories';

type EventsTeaserProps = React.ComponentProps<typeof EventsTeaserComponent>;

type StrictStory = StoryObj<typeof EventsTeaserComponent> & {
  args: EventsTeaserProps;
};

const meta: Meta<typeof EventsTeaserComponent> = {
  args: {},
  component: EventsTeaserComponent,
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
      text: 'Alle News',
    },
    items: [
      DateNotSameMonth.args,
      DateNotSameYear.args,
      Full.args,
    ],
    title: 'News',
  },
};
