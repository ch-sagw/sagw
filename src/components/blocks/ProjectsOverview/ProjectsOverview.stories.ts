import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { ProjectOverviewComponent } from '@/components/blocks/ProjectsOverview/ProjectsOverview.component';
import { defaultDecorator } from '@/storybook-helpers';
import { ProjectDetailPage } from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type ProjectsOverviewProps = React.ComponentProps<typeof ProjectOverviewComponent>;

type StrictStory = StoryObj<typeof ProjectOverviewComponent> & {
  args: ProjectsOverviewProps;
};

const meta: Meta<typeof ProjectOverviewComponent> = {
  args: {},
  component: ProjectOverviewComponent,
  decorators: [defaultDecorator],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/ProjectsOverview',
};

export default meta;

const pages: ProjectDetailPage[] = Array.from({
  length: 12,
}, (_, i) => {
  const index = i + 1;

  return ({
    createdAt: '2025-10-20T12:50:57.693Z',
    hero: {
      colorMode: 'white',
      lead: simpleRteConfig('Project Detail Page Lead'),
      title: simpleRteConfig(`Project detail page ${index}`),
    },
    id: index.toString(),
    navigationTitle: `Project Detail ${index}`,
    overviewPageProps: {
      linkText: simpleRteConfig('some text'),
      teaserText: simpleRteConfig('Project Teaser Text'),
    },
    project: '1',
    slug: 'slug',
    tenant: '1',
    updatedAt: '2025-10-20T12:50:57.693Z',
  });
});

export const SampleStory: StrictStory = {
  args: {
    blockType: 'projectsOverviewBlock',
    pages,
  },
};
