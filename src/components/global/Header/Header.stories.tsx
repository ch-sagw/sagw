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
import { InterfaceHeaderNavigation } from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

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

const navItemsLevel1Only: InterfaceHeaderNavigation['navItems'] = [
  {
    description: simpleRteConfig(''),
    id: '68d9683b1eed56c026882f30',
    navItemLink: {
      documentId: '1234',
      slug: 'some-slug',
    },
    navItemText: simpleRteConfig('Home'),
  },

  {
    description: simpleRteConfig('Förderung von langfristigen Forschungsinfrastrukturen'),
    id: '68d9683b1eed56c026882f36',
    navItemLink: {
      documentId: '1234',
      slug: 'some-slug',
    },
    navItemText: simpleRteConfig('Förderung'),
  },
  {
    description: simpleRteConfig('Unsere 63 Fachgesellschaften unter einem Dach'),
    id: '68d9683b1eed56c026882f38',
    navItemLink: {
      documentId: '1234',
      slug: 'some-slug',
    },
    navItemText: simpleRteConfig('Netzwerk'),
  },
  {
    description: simpleRteConfig('Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft'),
    id: '68d9683b1eed56c026882f3e',
    navItemLink: {
      documentId: '1234',
      slug: 'some-slug',
    },
    navItemText: simpleRteConfig('Aktivitäten'),
  },
  {
    description: simpleRteConfig('Alles Wissenswertes über die SAGW'),
    id: '68d9683b1eed56c026882f43',
    navItemLink: {
      documentId: '1234',
      slug: 'some-slug',
    },
    navItemText: simpleRteConfig('Über Uns'),
  },
];

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
  tenant: 'sagw',
};

const argsWithoutLevel2 = JSON.parse(JSON.stringify(defaultArgs));

argsWithoutLevel2.navigation.navItems = navItemsLevel1Only;

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

export const HeaderWithoutLevel2: StrictStory = {
  args: {
    ...argsWithoutLevel2,
    metanav: {
      metaLinks: [],
    },
  },
  render: (args) => render(args),
};

