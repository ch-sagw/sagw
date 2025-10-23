import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Navigation } from '@/components/base/Navigation/Navigation';
import {
  InterfaceNavigationItemChild, InterfaceNavigationItemPropTypes,
} from '../NavigationItem/NavigationItem';
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

const items2: InterfaceNavigationItemChild[] = [
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Pretty long Level 2 Nav Item Text to see how long texts work',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Projekte',
  },
];

const items3: InterfaceNavigationItemChild[] = [
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Medium sized nav text',
  },
  {
    link: 'foo',
    pageLanguage: 'de',
    text: 'Projekte',
  },
];

const headerSections: InterfaceNavigationItemPropTypes[] = [
  {
    colorMode: 'dark',
    link: 'foo',
    pageLanguage: 'de',
    text: 'Home',
  },
  {
    colorMode: 'dark',
    expandableId: '1',
    items: items2,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Förderung',
  },
  {
    colorMode: 'dark',
    expandableId: '2',
    items: items3,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Netzwerk',
  },
  {
    colorMode: 'dark',
    expandableId: '3',
    items: items2,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Aktivitäten',
  },
  {
    colorMode: 'dark',
    expandableId: '4',
    items,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Über Uns',
  },
];

const footerSections: InterfaceNavigationItemPropTypes[] = [
  {
    colorMode: 'dark',
    footer: true,
    link: 'foo',
    pageLanguage: 'de',
    text: 'Home',
  },
  {
    colorMode: 'dark',
    expandableId: '1',
    footer: true,
    items: items2,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Förderung',
  },
  {
    colorMode: 'dark',
    expandableId: '2',
    footer: true,
    items: items3,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Netzwerk',
  },
  {
    colorMode: 'dark',
    expandableId: '3',
    footer: true,
    items,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Aktivitäten',
  },
  {
    colorMode: 'dark',
    expandableId: '4',
    footer: true,
    items,
    onExpand: (): void => {
      console.log('some expand handler');
    },
    setExpanded: undefined,
    text: 'Über Uns',
  },
];

export const HeaderDark: StrictStory = {
  args: {
    colorMode: 'dark',
    footer: false,
    hoveredItemCallback: () => {
      console.log('some callback');
    },
    pageLanguage: 'de',
    sections: headerSections,
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const HeaderLight: StrictStory = {
  args: {
    colorMode: 'light',
    footer: false,
    hoveredItemCallback: () => {
      console.log('some callback');
    },
    pageLanguage: 'de',
    sections: headerSections,
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const HeaderWhite: StrictStory = {
  args: {
    colorMode: 'white',
    footer: false,
    hoveredItemCallback: () => {
      console.log('some callback');
    },
    pageLanguage: 'de',
    sections: headerSections,
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};

export const Footer: StrictStory = {
  args: {
    colorMode: 'dark',
    footer: true,
    pageLanguage: 'de',
    sections: footerSections,
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
