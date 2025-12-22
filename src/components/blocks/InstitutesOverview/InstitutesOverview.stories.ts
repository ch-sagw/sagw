import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { InstituteOverviewComponent } from '@/components/blocks/InstitutesOverview/InstitutesOverview.component';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { InstituteDetailPage } from '@/payload-types';
import { InstitutesTeaserImageSVG } from '@/components/blocks/helpers/imagesData';

type InstitutesOverviewProps = React.ComponentProps<typeof InstituteOverviewComponent>;

type StrictStory = StoryObj<typeof InstituteOverviewComponent> & {
  args: InstitutesOverviewProps;
};

const meta: Meta<typeof InstituteOverviewComponent> = {
  args: {},
  component: InstituteOverviewComponent,
  decorators: [defaultDecorator],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    'a11y:check',
  ],
  title: 'Components/blocks/InstitutesOverview',
};

export default meta;

const pages: InstituteDetailPage[] = Array.from({
  length: 12,
}, (_, i) => {
  const index = i + 1;

  return ({
    createdAt: '2025-10-20T12:50:57.693Z',
    hero: {
      colorMode: 'white',
      lead: simpleRteConfig('Institute Detail Page Lead'),
      title: simpleRteConfig(`Institute detail page title ${index}`),
    },
    id: index.toString(),
    navigationTitle: 'Institute',
    overviewPageProps: {
      image: InstitutesTeaserImageSVG,
      teaserText: simpleRteConfig(`Institute Teaser Text ${index}`),
    },
    slug: 'slug',
    tenant: '1',
    updatedAt: '2025-10-20T12:50:57.693Z',
  });
});

export const InstitutesOverview: StrictStory = {
  args: {
    blockType: 'institutesOverviewBlock',
    moreInfoButtonText: simpleRteConfig('Mehr erfahren'),
    pages,
  },
};
