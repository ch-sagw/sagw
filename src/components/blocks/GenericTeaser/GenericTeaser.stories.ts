import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { GenericTeaser } from '@/components/blocks/GenericTeaser/GenericTeaser';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { InterfaceGenericTeasersBlock } from '@/payload-types';

type GenericTeaserProps = React.ComponentProps<typeof GenericTeaser>;

type StrictStory = StoryObj<typeof GenericTeaser> & {
  args: GenericTeaserProps;
};

const meta: Meta<typeof GenericTeaser> = {
  args: {},
  component: GenericTeaser,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/GenericTeaser',
};

export default meta;

const teaserBlock: InterfaceGenericTeasersBlock['teasers'][number] = {
  linkInternal: {
    internalLink: {
      documentId: '1234',
      slug: 'projectDetailPage',
    },
    linkText: simpleRteConfig('Zum Projekt'),
  },
  linkType: 'internal',
  text: simpleRteConfig('Ab 2021 hat die Akademie zudem die Förderzuständigkeit für acht längerfristige Editionen vom SNF übernommen. '),
  title: simpleRteConfig('Plattform Ageing Society'),
};

const defaultArgs: GenericTeaserProps = {
  alignement: 'horizontal',
  blockType: 'genericTeasersBlock',
  lead: simpleRteConfig('Projekte mit gesellschaftlicher Relevanz an der Schnittstelle von Wissenschaft und Öffentlichkeit.'),
  pageLanguage: 'de',
  teasers: [
    teaserBlock,
    teaserBlock,
    teaserBlock,
  ],
  title: simpleRteConfig('Aktuelle Projekte'),
};

export const Horizontal: StrictStory = {
  args: defaultArgs,
};

export const Vertical: StrictStory = {
  args: {
    ...defaultArgs,
    alignement: 'vertical',
  },
};
