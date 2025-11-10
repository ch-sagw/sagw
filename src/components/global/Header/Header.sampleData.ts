import {
  InterfaceHeaderMetaNavigation, InterfaceHeaderNavigation,
} from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

export const defaultMetaNavItems: InterfaceHeaderMetaNavigation = {
  metaLinks: [
    {
      id: '68d9829011bbf7dfaf2c56ac',
      linkExternal: {
        externalLink: 'https://www.foo.bar',
        externalLinkText: simpleRteConfig('Brand Guidelines'),
      },
      linkType: 'external',
    },

    {
      id: '68d9829011bbf7dfaf2c56ad',
      linkExternal: {
        externalLink: 'https://www.foo.bar',
        externalLinkText: simpleRteConfig('Intranet'),
      },
      linkType: 'external',
    },
    {
      id: '68d9829011bbf7dfaf2c56ae',
      linkExternal: {
        externalLink: 'https://www.foo.bar',
        externalLinkText: simpleRteConfig('mySAGW'),
      },
      linkType: 'external',
    },
  ],
};

export const defaultNavItems: InterfaceHeaderNavigation['navItems'] = [
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
    navItemText: simpleRteConfig('Förderung'),
    subNavItems: [
      {
        id: '68d9683b1eed56c026882f31',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Übersicht'),
      },
      {
        id: '68d9683b1eed56c026882f32',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Institute'),
      },
      {
        id: '68d9683b1eed56c026882f33',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Editionen'),
      },
      {
        id: '68d9683b1eed56c026882f34',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Reisebeiträge'),
      },

      {
        id: '68d9683b1eed56c026882f35',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Early Career Award'),
      },
    ],
  },
  {
    description: simpleRteConfig('Unsere 63 Fachgesellschaften unter einem Dach'),
    id: '68d9683b1eed56c026882f38',
    navItemText: simpleRteConfig('Netzwerk'),
    subNavItems: [
      {
        id: '68d9683b1eed56c026882f37',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Fachgesellschaften'),
      },
    ],
  },
  {
    description: simpleRteConfig('Vermittlung von Wissen zwischen Wissenschaft und Gesellschaft'),
    id: '68d9683b1eed56c026882f3e',
    navItemText: simpleRteConfig('Aktivitäten'),
    subNavItems: [
      {
        id: '68d9683b1eed56c026882f39',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Übersicht'),
      },
      {
        id: '68d9683b1eed56c026882f3a',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Magazin'),
      },
      {
        id: '68d9683b1eed56c026882f3b',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Publikationen'),
      },
      {
        id: '68d9683b1eed56c026882f3c',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Veranstaltungen'),
      },
      {
        id: '68d9683b1eed56c026882f3d',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('News'),
      },
    ],
  },
  {
    description: simpleRteConfig('Alles Wissenswertes über die SAGW'),
    id: '68d9683b1eed56c026882f43',
    navItemText: simpleRteConfig('Über Uns'),
    subNavItems: [
      {
        id: '68d9683b1eed56c026882f3f',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Die SAGW'),
      },
      {
        id: '68d9683b1eed56c026882f40',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Team'),
      },
      {
        id: '68d9683b1eed56c026882f41',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Kontakt'),
      },
      {
        id: '68d9683b1eed56c026882f42',
        navItemLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        navItemText: simpleRteConfig('Offene Stellen'),
      },
    ],
  },
];
