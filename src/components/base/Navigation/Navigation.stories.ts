import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Navigation } from '@/components/base/Navigation/Navigation';
import { InterfaceNavigationItemPropTypes } from '../NavigationItem/NavigationItem';
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

const headerSections: InterfaceNavigationItemPropTypes[] = [
  {
    colorMode: 'dark',
    link: 'foo',
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
    sections: footerSections,
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};
