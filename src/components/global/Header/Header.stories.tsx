import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  Header, InterfaceHeaderPropTypes,
} from '@/components/global/Header/Header';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import React, { Fragment } from 'react';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  defaultMetaNavItems, defaultNavItems,
} from '@/components/global/Header/Header.sampleData';

type HeaderProps = React.ComponentProps<typeof Header>;

type StrictStory = StoryObj<typeof Header> & {
  args: HeaderProps;
};

const meta: Meta<typeof Header> = {
  args: {},
  component: Header,
  decorators: [defaultDecoratorNoPadding],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Header',
};

export default meta;

const render = (args: Partial<InterfaceHeaderPropTypes> & InterfaceHeaderPropTypes): React.JSX.Element => (
  <Fragment>
    <Header {...args} />

    {Array.from({
      length: 20,
    })
      .map((_, key) => (
        <p key={key} style={{
          marginTop: `${key === 0
            ? '0'
            : '100px'}`,
        }}>{key}: Some content</p>

      ))}
  </Fragment>

);

const defaultArgs: InterfaceHeaderPropTypes = {
  colorMode: 'dark',
  currentLang: 'de',
  langnav: {
    description: simpleRteConfig('Die SAGW Webseite ist in vier Sprachen verfügbar'),
    title: simpleRteConfig('Sprachen'),
  },
  logoLink: '/',
  menuButton: {
    close: 'Schliessen',
    open: 'Öffnen',
  },
  metanav: defaultMetaNavItems,
  navigation: {
    navItems: defaultNavItems,
  },

};

export const HeaderDark: StrictStory = {
  args: defaultArgs,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => render(args),
};

export const HeaderLight: StrictStory = {
  args: {
    ...defaultArgs,
    colorMode: 'light',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => render(args),
};

export const HeaderWhite: StrictStory = {
  args: {
    ...defaultArgs,
    colorMode: 'white',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => render(args),
};

export const HeaderWithoutMetanav: StrictStory = {
  args: {
    ...defaultArgs,
    metanav: {
      metaLinks: [],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => render(args),
};

