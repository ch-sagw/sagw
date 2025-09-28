import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  Header, InterfaceHeaderPropTypes,
} from '@/components/global/Header/Header';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import React, { Fragment } from 'react';

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
    description: 'Die SAGW Webseite ist in vier Sprachen verfügbar',
    title: 'Sprachen',
  },
  logo: {
    logo: 'sagw',
  },
  menuButton: {
    close: 'Schliessen',
    open: 'Öffnen',
  },
  metanav: {
    metaLinks: [
      {
        id: '68d9829011bbf7dfaf2c56ac',
        linkExternal: {
          externalLink: 'https://www.foo.bar',
          externalLinkText: 'Brand Guidelines',
        },
        linkType: 'external',
      },

      {
        id: '68d9829011bbf7dfaf2c56ad',
        linkExternal: {
          externalLink: 'https://www.foo.bar',
          externalLinkText: 'Intranet',
        },
        linkType: 'external',
      },
      {
        id: '68d9829011bbf7dfaf2c56ae',
        linkExternal: {
          externalLink: 'https://www.foo.bar',
          externalLinkText: 'mySAGW',
        },
        linkType: 'external',
      },
    ],
  },
  navigation: {
    navItems: [

      {
        description: '',
        id: '68d9683b1eed56c026882f30',
        navItemLink: '/',
        navItemText: 'Home',
      },

      {
        description: 'Förderung von langfristigen Forschungsinfrastrukturen',
        id: '68d9683b1eed56c026882f36',
        navItemText: 'Förderung',
        subNavItems: [
          {
            id: '68d9683b1eed56c026882f31',
            navItemLink: '/',
            navItemText: 'Übersicht',
          },
          {
            id: '68d9683b1eed56c026882f32',
            navItemLink: '/',
            navItemText: 'Institute',
          },
          {
            id: '68d9683b1eed56c026882f33',
            navItemLink: '/',
            navItemText: 'Editionen',
          },
          {
            id: '68d9683b1eed56c026882f34',
            navItemLink: '/',
            navItemText: 'Reisebeiträge',
          },

          {
            id: '68d9683b1eed56c026882f35',
            navItemLink: '/',
            navItemText: 'Early Career Award',
          },
        ],
      },
      {
        description: 'Unsere 63 Fachgesellschaften unter einem Dach',
        id: '68d9683b1eed56c026882f38',
        navItemText: 'Netzwerk',
        subNavItems: [
          {
            id: '68d9683b1eed56c026882f37',
            navItemLink: '/',
            navItemText: 'Fachgesellschaften',
          },
        ],
      },
      {
        description: 'Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft',
        id: '68d9683b1eed56c026882f3e',
        navItemText: 'Aktivitäten',
        subNavItems: [
          {
            id: '68d9683b1eed56c026882f39',
            navItemLink: '/',
            navItemText: 'Übersicht',
          },
          {
            id: '68d9683b1eed56c026882f3a',
            navItemLink: '/',
            navItemText: 'Magazin',
          },
          {
            id: '68d9683b1eed56c026882f3b',
            navItemLink: '/',
            navItemText: 'Publikationen',
          },
          {
            id: '68d9683b1eed56c026882f3c',
            navItemLink: '/',
            navItemText: 'Veranstaltungen',
          },
          {
            id: '68d9683b1eed56c026882f3d',
            navItemLink: '/',
            navItemText: 'News',
          },
        ],
      },
      {
        description: 'Alles Wissenswertes über die SAGW',
        id: '68d9683b1eed56c026882f43',
        navItemText: 'Über Uns',
        subNavItems: [
          {
            id: '68d9683b1eed56c026882f3f',
            navItemLink: '/',
            navItemText: 'Die SAGW',
          },
          {
            id: '68d9683b1eed56c026882f40',
            navItemLink: '/',
            navItemText: 'Team',
          },
          {
            id: '68d9683b1eed56c026882f41',
            navItemLink: '/',
            navItemText: 'Kontakt',
          },
          {
            id: '68d9683b1eed56c026882f42',
            navItemLink: '/',
            navItemText: 'Offene Stellen',
          },
        ],
      },
    ],
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

