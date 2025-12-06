import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { HomeTeaser } from '@/components/blocks/HomeTeaser/HomeTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type HomeTeaserProps = React.ComponentProps<typeof HomeTeaser>;

type StrictStory = StoryObj<typeof HomeTeaser> & {
  args: HomeTeaserProps;
};

const meta: Meta<typeof HomeTeaser> = {
  args: {},
  component: HomeTeaser,
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
    blockType: 'homeTeasersBlock',
    homeTeasers: [
      {
        category: 'Förderung',
        iconName: 'bar',
        link: {
          internalLink: {
            documentId: 'someid',
            slug: 'someslug',
          },
          linkText: simpleRteConfig('Zur Förderung'),
        },
        text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
        title: simpleRteConfig('Wir schaffen verlässliche Grundlagen für geistes- und sozialwissenschaftliche Forschung in der Schweiz.'),
      },

      {
        category: 'Netzwerk',
        iconName: 'bar',
        link: {
          internalLink: {
            documentId: 'someid',
            slug: 'someslug',
          },
          linkText: simpleRteConfig('Zum Netzwerkl'),
        },
        text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
        title: simpleRteConfig('Wir verbinden Disziplinen, Menschen und Institutionen in einem einzigartigen wissenschaftlichen Netzwerk.'),
      },

      {
        category: 'Aktivitäten',
        iconName: 'bar',
        link: {
          internalLink: {
            documentId: 'someid',
            slug: 'someslug',
          },
          linkText: simpleRteConfig('Zu den Aktivitäten'),
        },
        text: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, unterstützen Fachgesellschaften und zeichnen Nachwuchsforschende aus. Unsere Förderpraxis sichert Stabilität, Transparenz und Wirkung - als Beitrag zu einer vielfältigen und exzellenten Forschungslandschaft.'),
        title: simpleRteConfig('Wir initiieren Debatten und vermittelt Wissen zwischen Wissenschaft, Gesellschaft und Politik.'),
      },
    ],
  },
};
