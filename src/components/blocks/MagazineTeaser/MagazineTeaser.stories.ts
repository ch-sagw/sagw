import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { MagazineTeaserComponent } from '@/components/blocks/MagazineTeaser/MagazineTeaser.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { MagazineDetailPage } from '@/payload-types';

type MagazineTeaserProps = React.ComponentProps<typeof MagazineTeaserComponent>;

type StrictStory = StoryObj<typeof MagazineTeaserComponent> & {
  args: MagazineTeaserProps;
};

const meta: Meta<typeof MagazineTeaserComponent> = {
  args: {},
  component: MagazineTeaserComponent,
  decorators: [defaultDecoratorNoPadding],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/MagazineTeaser',
};

export default meta;

const samplePage: MagazineDetailPage = {
  content: [
    {
      alignment: 'center',
      blockType: 'imageBlock',
      credits: simpleRteConfig('some credits'),
      image: 'someid',
    },
  ],
  createdAt: '2025-11-19T11:29:09.521Z',
  hero: {
    author: simpleRteConfig('Author'),
    colorMode: 'white',
    date: '2030-08-01T12:00:00.000Z',
    lead: simpleRteConfig('Some lead'),
    title: simpleRteConfig('The Mobility Imperative in Academia'),
  },
  id: '1',
  navigationTitle: '',
  overviewPageProps: {
    teaserText: simpleRteConfig('Zur Kultur der Bookishness in der Erlebnisgesellschaft'),
  },
  slug: 'slug',
  tenant: '1',
  updatedAt: '2025-11-19T11:29:09.521Z',
};

const defaultArgs: MagazineTeaserProps = {
  alignement: 'horizontal',
  blockType: 'magazineTeasersBlock',
  lead: simpleRteConfig('Ausgewählte Artikel aus dem SAGW-Bulletin vertiefen aktuelle Themen aus den Geistes- und Sozialwissenschaften.'),
  optionalLink: {
    includeLink: true,
    link: {
      internalLink: {
        documentId: '1234',
        slug: 'projectDetailPage',
      },
      linkText: simpleRteConfig('Alle Artikel anzeigen'),
    },
  },
  pageLanguage: 'de',
  pages: [
    {
      ...samplePage,
      id: '1',
    },
    {
      ...samplePage,
      id: '2',
    },
    {
      ...samplePage,
      id: '3',
    },
    {
      ...samplePage,
      id: '4',
    },
  ],
  title: simpleRteConfig('Magazin'),
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
