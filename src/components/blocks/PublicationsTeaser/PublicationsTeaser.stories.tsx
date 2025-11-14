import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsTeaserComponent } from '@/components/blocks/PublicationsTeaser/PublicationsTeaser.component';
import {
  Full,
  NoTag,
} from '@/components/base/PublicationsListItem/PublicationsListItem.stories';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type PublicationsTeaserProps = React.ComponentProps<typeof PublicationsTeaserComponent>;

type StrictStory = StoryObj<typeof PublicationsTeaserComponent> & {
  args: PublicationsTeaserProps;
};

const meta: Meta<typeof PublicationsTeaserComponent> = {
  args: {},
  component: PublicationsTeaserComponent,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/PublicationsTeaser',
};

export default meta;

export const DefaultTeaser: StrictStory = {
  args: {
    allLink: {
      href: '/publications',
      text: 'Alle Publikationen',
    },
    items: [
      Full.args,
      Full.args,
      NoTag.args,
      Full.args,
    ],
    pageLanguage: 'de',
    title: 'Publikationen',
  },
};
