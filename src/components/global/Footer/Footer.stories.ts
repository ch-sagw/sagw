import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  FooterComponent, InterfaceFooterComponentPropTypes,
} from '@/components/global/Footer/Footer.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  defaultMetaNavItems, defaultNavItems,
} from '@/components/global/Header/Header.sampleData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { InterfaceFooterSocialLinks } from '@/payload-types';

type FooterProps = InterfaceFooterComponentPropTypes;

type StrictStory = StoryObj<typeof FooterComponent> & {
  args: FooterProps;
};

const meta: Meta<typeof FooterComponent> = {
  args: {},
  component: FooterComponent,
  decorators: [defaultDecoratorNoPadding],
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Footer',
};

export default meta;

const legal = {
  cookieSettings: simpleRteConfig('Cookie-Einstellungen'),
  copyright: simpleRteConfig('Schweizerische Akademie der Geistes- und Sozialwissenschaften SAGW'),
  dataPrivacy: simpleRteConfig('Datenschutz'),
  impressum: simpleRteConfig('Impressum'),
};

const contact = {
  address1: simpleRteConfig('Haus der Akademien'),
  address2: simpleRteConfig('Laupenstrasse 7'),
  city: simpleRteConfig('Bern'),
  countryCode: simpleRteConfig('CH'),
  mail: simpleRteConfig('sagw@sagw.ch'),
  phone: simpleRteConfig('+41 31 306 92 50'),
  poBox: simpleRteConfig('Postfach'),
  title: simpleRteConfig('SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften'),
  zipCode: simpleRteConfig('3001'),
};

const contactMinimal = {
  address1: simpleRteConfig('Haus der Akademien'),
  city: simpleRteConfig('Bern'),
  countryCode: simpleRteConfig('CH'),
  title: simpleRteConfig('SAGW Schweizerische Akademie der Geistes- und Sozialwissenschaften'),
  zipCode: simpleRteConfig('3001'),
};

const socialLinks: InterfaceFooterSocialLinks = {
  items: [
    {
      externalLink: 'https://www.foo.bar',
      icon: 'instagram',
    },
    {
      externalLink: 'https://www.foo.bar',
      icon: 'twitter',
    },
    {
      externalLink: 'https://www.foo.bar',
      icon: 'linkedIn',
    },
    {
      externalLink: 'https://www.foo.bar',
      icon: 'facebook',
    },
  ],
};

const consentOverlay = {
  analyticsPerformance: {
    text: 'Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.',
    textHtml: 'Diese Gruppe beinhaltet alle Cookies von Skripts für analytisches Tracking. Die Analysen helfen uns, die Nutzer*innenerfahrung der Website zu verbessern.',
    title: 'Analytics und Performance',
    titleHtml: 'Analytics und Performance',
    toggleDefault: 'on' as const,
    toggleLabelOff: 'Aus',
    toggleLabelOffHtml: 'Aus',
    toggleLabelOn: 'An',
    toggleLabelOnHtml: 'An',
  },
  buttonAcceptAll: 'Alle zulassen',
  buttonAcceptSelection: 'Auswahl zulassen',
  externalContent: {
    text: 'Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).',
    textHtml: 'Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir auf unserer Website Inhalte von deren Plattform bereitstellen können (wie z.B. Videos oder Social Media Feeds).',
    title: 'Externe Inhalte',
    titleHtml: 'Externe Inhalte',
    toggleDefault: 'on' as const,
    toggleLabelOff: 'Aus',
    toggleLabelOffHtml: 'Aus',
    toggleLabelOn: 'An',
    toggleLabelOnHtml: 'An',
  },
  necessaryCookies: {
    text: 'Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.',
    textHtml: 'Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Ohne sie ist nicht gewährleistet, dass die Website einwandfrei funktioniert.',
    title: 'Notwendige Cookies',
    titleHtml: 'Notwendige Cookies',
    toggleDefault: 'on' as const,
    toggleLabel: 'Immer an',
    toggleLabelHtml: 'Immer an',
  },
  text: 'Sie haben die volle Kontrolle über Ihre Privatsphäre und entscheiden selbst, welche Cookies wir verwenden dürfen und welche nicht.',
  title: 'Cookies Einstellungen',
};

const defaultArgs: InterfaceFooterComponentPropTypes = {
  consentOverlay,
  contact,
  legal,
  linkUrls: {},
  metaNav: defaultMetaNavItems,
  navigation: {
    navItems: defaultNavItems,
  },
  socialLinks,
  structuredDataImage: 'www.sagw.ch/logo.svg',
  structuredDataUrl: 'https://www.sagw.ch',
};

export const FooterSagw: StrictStory = {
  args: {
    ...defaultArgs,
  },
};

export const FooterFg: StrictStory = {
  args: {
    ...defaultArgs,
    contact: contactMinimal,
    fg: {
      sagwLink: 'www.sagw.ch',
      sagwLinkText: 'Go to SAGW main page',
    },
  },
};
