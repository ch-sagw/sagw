import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Navigation } from '@/components/base/Navigation/Navigation';
import { defaultDecorator } from '@/storybook-helpers';

type NavigationProps = React.ComponentProps<typeof Navigation>;

type StrictStory = StoryObj<typeof Navigation> & {
  args: NavigationProps;
};

const meta: Meta<typeof Navigation> = {
  args: {},
  component: Navigation,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Navigation',
};

export default meta;

const items = [
  {
    link: 'foo',
    text: 'Übersicht',
  },
  {
    link: 'foo',
    text: 'Projekte',
  },
  {
    link: 'foo',
    text: 'Magazin',
  },
  {
    link: 'foo',
    text: 'Publikationen',
  },
  {
    link: 'foo',
    text: 'Veranstaltungen',
  },
  {
    link: 'foo',
    text: 'News',
  },
];

const items2 = [
  {
    link: 'foo',
    text: 'Pretty long Level 2 Nav Item Text to see how long texts work',
  },
  {
    link: 'foo',
    text: 'Projekte',
  },
];

const items3 = [
  {
    link: 'foo',
    text: 'Medium sized nav text',
  },
  {
    link: 'foo',
    text: 'Projekte',
  },
];

export const Header: StrictStory = {
  args: {
    footer: false,
    sections: [
      {
        link: 'foo',
        text: 'Home',
      },
      {
        expandableId: 1,
        items: items2,
        text: 'Förderung',
      },
      {
        expandableId: 2,
        items: items3,
        text: 'Netzwerk',
      },
      {
        expandableId: 3,
        items: items2,
        text: 'Aktivitäten',
      },
      {
        expandableId: 4,
        items,
        text: 'Über Uns',
      },
    ],
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const Footer: StrictStory = {
  args: {
    footer: true,
    sections: [
      {
        footer: true,
        link: 'foo',
        text: 'Home',
      },
      {
        expandableId: 1,
        footer: true,
        items: items2,
        text: 'Förderung',
      },
      {
        expandableId: 2,
        footer: true,
        items: items3,
        text: 'Netzwerk',
      },
      {
        expandableId: 3,
        footer: true,
        items,
        text: 'Aktivitäten',
      },
      {
        expandableId: 4,
        footer: true,
        items,
        text: 'Über Uns',
      },
    ],
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
