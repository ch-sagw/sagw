import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  HomeTeaserClient, type InterfaceHomeTeaserClientPropTypes,
} from '@/components/blocks/HomeTeaser/HomeTeaser.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof HomeTeaserClient> & {
  args: InterfaceHomeTeaserClientPropTypes;
};

const meta: Meta<typeof HomeTeaserClient> = {
  args: {},
  component: HomeTeaserClient,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/HomeTeaser',
};

export default meta;

export const HomeTeasers: StrictStory = {
  args: {
    teasers: [
      {
        category: 'Aktivitäten',
        iconName: 'homeTeaserActivities',
        linkHref: '/example-page-1',
        linkTextHtml: rteToHtml(simpleRteConfig('Zu den Aktivitäten')),
        textHtml: rteToHtml(simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.')),
        titleHtml: rteToHtml(simpleRteConfig('Wir initiieren Debatten und vermittelt Wissen zwischen Wissenschaft, Gesellschaft und Politik.')),
      },
      {
        category: 'Förderung',
        iconName: 'homeTeaserFunding',
        linkHref: '/example-page-2',
        linkTextHtml: rteToHtml(simpleRteConfig('Zur Förderung')),
        textHtml: rteToHtml(simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.')),
        titleHtml: rteToHtml(simpleRteConfig('Wir schaffen verlässliche Grundlagen für geistes- und sozialwissenschaftliche Forschung in der Schweiz.')),
      },
      {
        category: 'Netzwerk',
        iconName: 'homeTeaserFunding',
        linkHref: '/example-page-3',
        linkTextHtml: rteToHtml(simpleRteConfig('um Netzwerk')),
        textHtml: rteToHtml(simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.')),
        titleHtml: rteToHtml(simpleRteConfig('Wir verbinden Disziplinen, Menschen und Institutionen in einem einzigartigen wissenschaftlichen Netzwerk.')),
      },
    ],
  },
};
