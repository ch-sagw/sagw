import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ProjectsTeaserComponent } from '@/components/blocks/ProjectsTeaser/ProjectsTeaser.component';
import { defaultDecorator } from '@/storybook-helpers';
import { ProjectDetailPage } from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type ProjectsTeaserProps = React.ComponentProps<typeof ProjectsTeaserComponent>;

type StrictStory = StoryObj<typeof ProjectsTeaserComponent> & {
  args: ProjectsTeaserProps;
};

const teaserBlock: ProjectDetailPage = {
  createdAt: '2025-11-19T11:29:09.521Z',
  hero: {
    colorMode: 'white',
    lead: simpleRteConfig('Some Lead'),
    title: simpleRteConfig('Plattform Ageing Society'),
  },
  id: '1',
  navigationTitle: 'NavTitle',
  overviewPageProps: {
    linkText: simpleRteConfig('Zum Projekt'),
    teaserText: simpleRteConfig('Ab 2021 hat die Akademie zudem die Förderzuständigkeit für acht längerfristige Editionen vom SNF übernommen. '),
  },
  project: '1',
  tenant: '1',
  updatedAt: '2025-11-19T11:29:09.521Z',
};

const meta: Meta<typeof ProjectsTeaserComponent> = {
  args: {},
  component: ProjectsTeaserComponent,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/ProjectsTeaser',
};

export default meta;

export const ProjectTeaser: StrictStory = {
  args: {
    alignement: 'horizontal',
    blockType: 'projectsTeasersBlock',
    internalLink: {
      documentId: '1',
      slug: 'OverviewPage',
    },
    lead: simpleRteConfig('Projekte mit gesellschaftlicher Relevanz an der Schnittstelle von Wissenschaft und Öffentlichkeit.'),
    linkText: simpleRteConfig('Zum Projekt'),
    pages: [
      {
        ...teaserBlock,
        id: '1',
      },
      {
        ...teaserBlock,
        id: '1',
      },
      {
        ...teaserBlock,
        id: '1',
      },
      {
        ...teaserBlock,
        id: '1',
      },
    ],
    title: simpleRteConfig('Aktuelle Projekte'),
  },
};
