import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Footer } from '@/components/global/Footer/Footer';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import {
  defaultMetaNavItems, defaultNavItems,
} from '@/components/global/Header/Header.sampleData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { InterfaceFooterSocialLinks } from '@/payload-types';

type FooterProps = React.ComponentProps<typeof Footer>;

type StrictStory = StoryObj<typeof Footer> & {
  args: FooterProps;
};

const meta: Meta<typeof Footer> = {
  args: {},
  component: Footer,
  decorators: [defaultDecoratorNoPadding],
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
  parameters: {
    layout: 'fullscreen',
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
  copyright: simpleRteConfig('© Schweizerische Akademie der Geistes- und Sozialwissenschaften SAGW 2025'),
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
      externalLinkText: simpleRteConfig('Visit us on Instagram'),
      icon: 'instagram',
    },
    {
      externalLink: 'https://www.foo.bar',
      externalLinkText: simpleRteConfig('Visit us on Twitter'),
      icon: 'twitter',
    },
    {
      externalLink: 'https://www.foo.bar',
      externalLinkText: simpleRteConfig('Visit us on linkedIn'),
      icon: 'linkedIn',
    },
    {
      externalLink: 'https://www.foo.bar',
      externalLinkText: simpleRteConfig('Visit us on Facebook'),
      icon: 'facebook',
    },
  ],
};

const defaultArgs = {
  contact,
  legal,
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
