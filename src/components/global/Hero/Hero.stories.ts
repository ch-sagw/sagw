import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Hero } from '@/components/global/Hero/Hero';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { InterfaceBreadcrumbPropTypes } from '@/components/base/Breadcrumb/Breadcrumb';
import { homeHeroTitle } from '@/utilities/rteSampleContent';

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

const breadcrumb: InterfaceBreadcrumbPropTypes = {
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
};

export const Home: StrictStory = {
  args: {
    optionalLink: {
      includeLink: true,
      link: {
        internalLink: {
          documentId: '1234',
          slug: 'some-slug',
        },
        linkText: simpleRteConfig('Über uns'),
      },
    },
    sideTitle: simpleRteConfig('Die Schweizer Akademie der Geistes- und Sozialwissenschaften'),
    title: homeHeroTitle,
    type: 'home',
  },
};

export const HomeWithLead: StrictStory = {
  args: {
    ...Home.args,
    lead: simpleRteConfig('Wir stärken die Geistes- und Sozialwissenschaften in der Schweiz - mit fundierter Förderung, interdisziplinären Netzwerken und sichtbaren Aktivitäten. Wir verbinden Menschen und Themen, die unsere Gesellschaft weiterbringen.'),
    title: simpleRteConfig('Fördern, vernetzen, vermitteln'),
  },
};

export const MagazineDetail: StrictStory = {
  args: {
    author: simpleRteConfig('Lea Haller'),
    breadcrumb: {
      ...breadcrumb,
      colorMode: 'white',
    },
    colorMode: 'white',
    date: '2025-08-31T12:00:00.000Z',
    exportArticleText: simpleRteConfig('Artikel exportieren'),
    lead: simpleRteConfig('Intelligenz und Dummheit sind als Konzepte eng miteinander verwoben. Als man die Vernunft als Motor des Fortschritts anzusehen begann, geriet auch die Dummheit verstärkt ins Visier. Dass sie bis heute nicht ausgerottet werden konnte, gehört zu den wohl grössten Kränkungen der Menschheit. Klar ist: Dumm sind in der Regel die anderen.'),
    title: simpleRteConfig('Dummheit: Die andere Seite der Medaille'),
    type: 'magazineDetail',
  },
};

export const NewsDetail: StrictStory = {
  args: {
    breadcrumb: {
      ...breadcrumb,
      colorMode: 'white',
    },
    colorMode: 'white',
    date: '2025-08-31T12:00:00.000Z',
    title: simpleRteConfig('„Verstehen, was ist“ - Die SAGW stellt ihre Strategie 2025-2028 vor'),
    type: 'newsDetail',
  },
};

export const NewsDetailWithLead: StrictStory = {
  args: {
    ...NewsDetail.args,
    lead: simpleRteConfig('Intelligenz und Dummheit sind als Konzepte eng miteinander verwoben. Als man die Vernunft als Motor des Fortschritts anzusehen begann, geriet auch die Dummheit verstärkt ins Visier. Dass sie bis heute nicht ausgerottet werden konnte, gehört zu den wohl grössten Kränkungen der Menschheit. Klar ist: Dumm sind in der Regel die anderen.'),
  },
};

export const EventDetail: StrictStory = {
  args: {
    breadcrumb: {
      ...breadcrumb,
      colorMode: 'light',
    },
    colorMode: 'light',
    eventDetails: {
      dateEnd: '2025-09-01T12:00:00.000Z',
      dateStart: '2025-08-31T12:00:00.000Z',
      eventLocation: 'Basel',
      language: 'In English',
    },
    tag: 'Konferenz',
    title: simpleRteConfig('SGAS/SSEA & VAD Conference: African Perspectives on Global Transformations'),
    type: 'eventDetail',
  },
};

export const EventDetailWithLead: StrictStory = {
  args: {
    ...EventDetail.args,
    lead: simpleRteConfig('Intelligenz und Dummheit sind als Konzepte eng miteinander verwoben. Als man die Vernunft als Motor des Fortschritts anzusehen begann, geriet auch die Dummheit verstärkt ins Visier. Dass sie bis heute nicht ausgerottet werden konnte, gehört zu den wohl grössten Kränkungen der Menschheit. Klar ist: Dumm sind in der Regel die anderen.'),
  },
};

export const Generic: StrictStory = {
  args: {
    breadcrumb: {
      ...breadcrumb,
      colorMode: 'light',
    },
    colorMode: 'light',
    lead: simpleRteConfig('Intelligenz und Dummheit sind als Konzepte eng miteinander verwoben. Als man die Vernunft als Motor des Fortschritts anzusehen begann, geriet auch die Dummheit verstärkt ins Visier. Dass sie bis heute nicht ausgerottet werden konnte, gehört zu den wohl grössten Kränkungen der Menschheit. Klar ist: Dumm sind in der Regel die anderen.'),
    title: simpleRteConfig('Wir fördern langfristige Forschungsinfrastrukturen, vernetzen Akteure und vermitteln Wissen.'),
    type: 'generic',
  },
};
