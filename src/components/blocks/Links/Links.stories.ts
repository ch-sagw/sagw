import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Links } from '@/components/blocks/Links/Links';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type LinksProps = React.ComponentProps<typeof Links>;

type StrictStory = StoryObj<typeof Links> & {
  args: LinksProps;
};

const meta: Meta<typeof Links> = {
  args: {},
  component: Links,
  decorators: [defaultDecoratorNoPadding],
  globals: {
    backgrounds: {
      value: 'light',
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
  title: 'Components/blocks/Links',
};

export default meta;

export const LinksBlock: StrictStory = {
  args: {
    blockType: 'linksBlock',
    links: [
      {
        linkExternal: {
          description: simpleRteConfig('Offenes Repository für EU-finanzierte Forschungsergebnisse aus Horizon Europe, Euratom und früheren Rahmenprogrammen.'),
          externalLink: 'https://foo.bar',
          externalLinkText: simpleRteConfig('Artikel auf Zenodo'),
        },
        linkType: 'external',
      },
      {
        linkInternal: {
          internalLink: 'https://foo.bar',
          linkText: simpleRteConfig('Artikel auf Zenodo'),
        },
        linkType: 'internal',
      },
      {
        linkMail: {
          email: 'foo@bar.com',
          linkText: simpleRteConfig('Schreiben Sie eine E-Mail'),
        },
        linkType: 'mail',
      },
    ],
    title: simpleRteConfig('Links'),
  },
};
