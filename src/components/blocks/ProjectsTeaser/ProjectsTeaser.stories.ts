import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import {
  type InterfaceProjectsTeaserClientPropTypes, ProjectsTeaserClient,
} from '@/components/blocks/ProjectsTeaser/ProjectsTeaser.client';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { rteToHtml } from '@/utilities/rteToHtml';

type StrictStory = StoryObj<typeof ProjectsTeaserClient> & {
  args: InterfaceProjectsTeaserClientPropTypes;
};

const meta: Meta<typeof ProjectsTeaserClient> = {
  args: {},
  component: ProjectsTeaserClient,
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

export const Horizontal: StrictStory = {
  args: {
    alignement: 'horizontal',
    items: [
      {
        id: '1',
        link: {
          href: '/project-1',
          text: rteToHtml(simpleRteConfig('Learn More')),
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the first project teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Project Title 1')),
      },
      {
        id: '2',
        link: {
          href: '/project-2',
          text: rteToHtml(simpleRteConfig('Learn More')),
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the second project teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Project Title 2')),
      },
      {
        id: '3',
        link: {
          href: '/project-3',
          text: rteToHtml(simpleRteConfig('Learn More')),
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the third project teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Project Title 3')),
      },
    ],
    optionalLink: {
      href: '/all-projects',
      linkTextHtml: rteToHtml(simpleRteConfig('View All Projects')),
    },
    subtitleHtml: rteToHtml(simpleRteConfig('Projects with societal relevance at the intersection of science and the public.')),
    titleHtml: rteToHtml(simpleRteConfig('Current Projects')),
  },
};

export const Vertical: StrictStory = {
  args: {
    alignement: 'vertical',
    items: [
      {
        id: '1',
        link: {
          href: '/project-1',
          text: rteToHtml(simpleRteConfig('Learn More')),
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the first project teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Project Title 1')),
      },
      {
        id: '2',
        link: {
          href: '/project-2',
          text: rteToHtml(simpleRteConfig('Learn More')),
          type: 'internal',
        },
        textHtml: rteToHtml(simpleRteConfig('This is the second project teaser text content.')),
        titleHtml: rteToHtml(simpleRteConfig('Project Title 2')),
      },
    ],
    optionalLink: null,
    subtitleHtml: rteToHtml(simpleRteConfig('Projects with societal relevance at the intersection of science and the public.')),
    titleHtml: rteToHtml(simpleRteConfig('Current Projects')),
  },
};
