import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PeopleOverviewComponent } from '@/components/blocks/PeopleOverview/PeopleOverview.component';
import { defaultDecorator } from '@/storybook-helpers';
import {
  Person, Team,
} from '@/payload-types';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type PeopleOverviewProps = React.ComponentProps<typeof PeopleOverviewComponent>;

type StrictStory = StoryObj<typeof PeopleOverviewComponent> & {
  args: PeopleOverviewProps;
};

const meta: Meta<typeof PeopleOverviewComponent> = {
  args: {},
  component: PeopleOverviewComponent,
  decorators: [defaultDecorator],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: [
    'autodocs',
    // TODO: enable after image is integrated
    // 'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/PeopleOverview',
};

export default meta;

const people: Person[] = Array.from({
  length: 12,
}, (_, i) => {
  const index = i + 1;

  return ({
    createdAt: '2025-10-20T12:50:57.693Z',
    firstname: simpleRteConfig(`Firstname ${index}`),
    fullName: `Firstname ${index} Lastname ${index}`,
    function: simpleRteConfig('Some function'),
    id: index.toString(),
    image: 'someimage',
    lastname: simpleRteConfig(`Lastname ${index}`),
    mail: 'foo@bar.com',
    phone: '031 123 45 67',
    tenant: '1',
    updatedAt: '2025-10-20T12:50:57.693Z',
  });
});

const team: Team = {
  createdAt: '2025-10-20T12:50:57.693Z',
  id: '1',
  name: simpleRteConfig('Team 1'),
  people: people.map((item) => item.id),
  tenant: '1',
  updatedAt: '2025-10-20T12:50:57.693Z',
};

export const SampleStory: StrictStory = {
  args: {
    people,
    team,
  },
};
