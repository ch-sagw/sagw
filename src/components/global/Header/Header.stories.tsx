import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  HeaderComponent, InterfaceHeaderComponentPropTypes,
} from '@/components/global/Header/Header.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import React, { Fragment } from 'react';
import {
  defaultMetaNavItems, defaultNavItems,
} from '@/components/global/Header/Header.sampleData';

type HeaderProps = InterfaceHeaderComponentPropTypes;

type StrictStory = StoryObj<typeof HeaderComponent> & {
  args: HeaderProps;
};

const meta: Meta<typeof HeaderComponent> = {
  args: {},
  component: HeaderComponent,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Header',
};

export default meta;

const render = (args: Partial<InterfaceHeaderComponentPropTypes> & InterfaceHeaderComponentPropTypes): React.JSX.Element => (
  <Fragment>
    <HeaderComponent {...args} />

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

const defaultArgs: InterfaceHeaderComponentPropTypes = {
  colorMode: 'dark',
  linkUrls: {},
  localeUrls: {
    de: '/de',
    en: '/en',
    fr: '/fr',
    it: '/it',
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
  render: (args) => render(args),
};

export const HeaderWhite: StrictStory = {
  args: {
    ...defaultArgs,
    colorMode: 'white',
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
  render: (args) => render(args),
};

