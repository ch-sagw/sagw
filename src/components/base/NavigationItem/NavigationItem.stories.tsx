import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { NavigationItem } from '@/components/base/NavigationItem/NavigationItem';
import { defaultDecorator } from '@/storybook-helpers';

type NavigationItemProps = React.ComponentProps<typeof NavigationItem>;

type StrictStory = StoryObj<typeof NavigationItem> & {
  args: NavigationItemProps;
};

const meta: Meta<typeof NavigationItem> = {
  args: {},
  component: NavigationItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/NavigationItem',
};

export default meta;

export const WithChildren: StrictStory = {
  args: {
    expandableId: 1,
    items: [
      {
        link: 'Übersicht',
        text: 'foo',
      },
      {
        link: 'Projekte',
        text: 'foo',
      },
      {
        link: 'Magazin',
        text: 'foo',
      },
      {
        link: 'Publikationen',
        text: 'foo',
      },
      {
        link: 'Veranstaltungen',
        text: 'foo',
      },
      {
        link: 'News',
        text: 'foo',
      },
    ],
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const WithoutChildren: StrictStory = {
  args: {
    link: 'foo',
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
