import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  InterfaceMetanavItem, Metanav,
} from '@/components/base/Metanav/Metanav';
import { defaultDecorator } from '@/storybook-helpers';

type MetanavProps = React.ComponentProps<typeof Metanav>;

type StrictStory = StoryObj<typeof Metanav> & {
  args: MetanavProps;
};

const meta: Meta<typeof Metanav> = {
  args: {},
  component: Metanav,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Metanav',
};

export default meta;

const items: InterfaceMetanavItem[] = [
  {
    link: 'https://foo.bar',
    target: '_blank',
    text: 'Brand Guidelines',
  },
  {
    link: 'https://foo.bar',
    target: '_blank',
    text: 'Intranet',
  },
  {
    link: 'https://foo.bar',
    target: '_blank',
    text: 'mySAGW',
  },
];

export const MetanavDark: StrictStory = {
  args: {
    colorMode: 'dark',
    items,
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const MetanavLight: StrictStory = {
  args: {
    colorMode: 'light',
    items,
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const MetanavWhite: StrictStory = {
  args: {
    colorMode: 'white',
    items,
  },
  globals: {
    backgrounds: {
      value: 'white',
    },
  },
};
