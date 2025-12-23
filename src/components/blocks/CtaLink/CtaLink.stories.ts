import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  CtaLinkClient, type InterfaceCtaLinkClientPropTypes,
} from '@/components/blocks/CtaLink/CtaLink.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof CtaLinkClient> & {
  args: InterfaceCtaLinkClientPropTypes;
};

const meta: Meta<typeof CtaLinkClient> = {
  args: {},
  component: CtaLinkClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/CtaLink',
};

export default meta;

export const CtaInternalLink: StrictStory = {
  args: {
    linkHref: '/example-page',
    linkText: rteToHtml(simpleRteConfig('Learn More')),
    linkType: 'internal',
    subtitleHtml: rteToHtml(simpleRteConfig('This is a subtitle for the CTA link component.')),
    titleHtml: rteToHtml(simpleRteConfig('CTA Link Title')),
  },
};

export const CtaExternalLink: StrictStory = {
  args: {
    linkHref: 'https://example.com',
    linkText: rteToHtml(simpleRteConfig('Visit External Site')),
    linkType: 'external',
    subtitleHtml: rteToHtml(simpleRteConfig('This is a subtitle for the external CTA link.')),
    titleHtml: rteToHtml(simpleRteConfig('External CTA Link')),
  },
};

export const CtaMailLink: StrictStory = {
  args: {
    linkHref: 'mailto:contact@example.com',
    linkText: rteToHtml(simpleRteConfig('Contact Us')),
    linkType: 'mail',
    subtitleHtml: rteToHtml(simpleRteConfig('Get in touch with us via email.')),
    titleHtml: rteToHtml(simpleRteConfig('Contact CTA')),
  },
};
