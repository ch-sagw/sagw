import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Hero } from '@/components/global/Hero/Hero';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type HeroProps = React.ComponentProps<typeof Hero>;

type StrictStory = StoryObj<typeof Hero> & {
  args: HeroProps;
};

const meta: Meta<typeof Hero> = {
  args: {},
  component: Hero,
  decorators: [defaultDecoratorNoPadding],
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/global/Hero',
};

export default meta;

export const Home: StrictStory = {
  args: {
    optionalLink: {
      includeLink: true,
      link: {
        internalLink: 'someId',
        linkText: simpleRteConfig('Über uns'),
      },
    },
    pageLanguage: 'de',
    sideTitle: simpleRteConfig('Die Schweizer Akademie der Geistes- und Sozialwissenschaften'),
    title: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, vernetzen Akteure und vermitteln Wissen.'),
    type: 'home',
  },
};

export const MagazineDetail: StrictStory = {
  args: {
    author: simpleRteConfig('Lea Haller'),
    breadcrumb: {
      colorMode: 'white',
      items: [
        {
          link: 'https://www.foo.bar',
          text: 'Aktivitäten',
        },
        {
          link: 'https://www.foo.bar',
          text: 'Magazin',
        },
      ],
      pageLanguage: 'de',
    },
    colorMode: 'white',
    date: '2025-08-31T12:00:00.000Z',
    exportArticleText: simpleRteConfig('Artikel exportieren'),
    lead: simpleRteConfig('Intelligenz und Dummheit sind als Konzepte eng miteinander verwoben. Als man die Vernunft als Motor des Fortschritts anzusehen begann, geriet auch die Dummheit verstärkt ins Visier. Dass sie bis heute nicht ausgerottet werden konnte, gehört zu den wohl grössten Kränkungen der Menschheit. Klar ist: Dumm sind in der Regel die anderen.'),
    pageLanguage: 'de',
    title: simpleRteConfig('Dummheit: Die andere Seite der Medaille'),
    type: 'magazineDetail',
  },
};

export const NewsDetail: StrictStory = {
  args: {
    breadcrumb: {
      colorMode: 'white',
      items: [
        {
          link: 'https://www.foo.bar',
          text: 'Aktivitäten',
        },
        {
          link: 'https://www.foo.bar',
          text: 'Magazin',
        },
      ],
      pageLanguage: 'de',
    },
    colorMode: 'white',
    date: '2025-08-31T12:00:00.000Z',
    pageLanguage: 'de',
    title: simpleRteConfig('„Verstehen, was ist“ - Die SAGW stellt ihre Strategie 2025-2028 vor'),
    type: 'newsDetail',
  },
};

export const EventDetail: StrictStory = {
  args: {
    breadcrumb: {
      colorMode: 'light',
      items: [
        {
          link: 'https://www.foo.bar',
          text: 'Aktivitäten',
        },
        {
          link: 'https://www.foo.bar',
          text: 'Magazin',
        },
      ],
      pageLanguage: 'de',
    },
    colorMode: 'light',
    eventDetails: {
      dateEnd: '2025-09-01T12:00:00.000Z',
      dateStart: '2025-08-31T12:00:00.000Z',
      eventLocation: 'Basel',
      language: 'In English',
    },
    pageLanguage: 'de',
    tag: 'Konferenz',
    title: simpleRteConfig('SGAS/SSEA & VAD Conference: African Perspectives on Global Transformations'),
    type: 'eventDetail',
  },
};
