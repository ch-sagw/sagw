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

// Intentionally not importing `getLocaleCodes` from i18n/payloadConfig:
// that module imports `payload` and would pull it into the Storybook
// bundle, which breaks Vite + file-type.
const allLocalesForStory: InterfaceHeaderComponentPropTypes['enabledLocales'] = [
  'de',
  'fr',
  'it',
  'en',
];

const defaultArgs: InterfaceHeaderComponentPropTypes = {
  colorMode: 'dark',
  enabledLocales: allLocalesForStory,
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
  tenant: 'sagw',
};

export const HeaderDark: StrictStory = {
  args: defaultArgs,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => render(args),
};

export const HeaderSslasDark: StrictStory = {
  args: {
    ...defaultArgs,
    colorMode: 'dark',
    tenant: 'sslas',
  },
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

export const HeaderSslasLight: StrictStory = {
  args: {
    ...defaultArgs,
    colorMode: 'light',
    tenant: 'sslas',
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
  render: (args) => render(args),
};

export const HeaderSslasWhite: StrictStory = {
  args: {
    ...defaultArgs,
    colorMode: 'white',
    tenant: 'sslas',
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
  render: (args) => render(args),
};

