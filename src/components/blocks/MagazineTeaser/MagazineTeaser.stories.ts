import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { MagazineTeaserComponent } from '@/components/blocks/MagazineTeaser/MagazineTeaser.component';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { MagazineTeaserImage } from '@/components/blocks/helpers/imagesData';
import { InterfaceMagazineDetailPageWithImage } from '@/components/blocks/MagazineOverview/MagazineOverview';
import { prerenderPageLinksStorybook } from '@/utilities/prerenderPageLinksStorybook';

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
    'a11y:check',
  ],
  title: 'Components/blocks/MagazineTeaser',
};

export default meta;

const samplePage: InterfaceMagazineDetailPageWithImage = {
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
  image: MagazineTeaserImage,
  navigationTitle: '',
  overviewPageProps: {
    teaserText: simpleRteConfig('Zur Kultur der Bookishness in der Erlebnisgesellschaft'),
  },
  parentPage: {
    documentId: '1234',
    slug: 'homePage',
  },
  slug: 'slug',
  tenant: '1',
  updatedAt: '2025-11-19T11:29:09.521Z',
};

const pages = [
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
];

const defaultArgs: MagazineTeaserProps = {
  alignment: 'horizontal',
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
  pageUrls: prerenderPageLinksStorybook({
    pages,
  }),
  pages,
  title: simpleRteConfig('Magazin'),
};

export const Horizontal: StrictStory = {
  args: defaultArgs,
};

export const Vertical: StrictStory = {
  args: {
    ...defaultArgs,
    alignment: 'vertical',
  },
};
