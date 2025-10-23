import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  InterfaceNavigationItemChild, NavigationItem,
} from '@/components/base/NavigationItem/NavigationItem';
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

const items: InterfaceNavigationItemChild[] = [
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Übersicht',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Projekte',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Magazin',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Publikationen',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Veranstaltungen',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'News',
  },
];

export const WithChildren: StrictStory = {
  args: {
    colorMode: 'dark',
    expandableId: '1',
    items,
    onExpand: () => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const WithChildrenLight: StrictStory = {
  args: {
    colorMode: 'light',
    expandableId: '1',
    items,
    onExpand: () => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const WithChildrenWhite: StrictStory = {
  args: {
    colorMode: 'white',
    expandableId: '1',
    items,
    onExpand: () => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};

export const WithoutChildren: StrictStory = {
  args: {
    colorMode: 'dark',
    link: 'foo',
    pageLanguage: 'de',
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const Footer: StrictStory = {
  args: {
    colorMode: 'dark',
    expandableId: '1',
    footer: true,
    items,
    onExpand: () => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Förderung',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

