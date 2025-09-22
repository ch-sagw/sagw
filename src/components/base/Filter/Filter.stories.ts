import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Filter } from '@/components/base/Filter/Filter';
import { defaultDecorator } from '@/storybook-helpers';

type FilterProps = React.ComponentProps<typeof Filter>;

type StrictStory = StoryObj<typeof Filter> & {
  args: FilterProps;
};

const meta: Meta<typeof Filter> = {
  args: {},
  component: Filter,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Filter',
};

export default meta;

export const SpecialisedSocieties: StrictStory = {
  args: {
    filterItems: [
      {
        checked: true,
        label: 'All',
        value: 'all',
      },
      {
        checked: false,
        label: 'History and archaeology',
        value: 'history-and-archaeology',
      },
      {
        checked: false,
        label: 'Art, music and museums',
        value: 'art-music-and-mueseums',
      },
      {
        checked: false,
        label: 'Language and literature',
        value: 'language-and-literature',
      },
      {
        checked: false,
        label: 'Philosophy, cultures and religions',
        value: 'philosophy-cultures-and-religions',
      },
      {
        checked: false,
        label: 'Economics and law',
        value: 'economics-and-law',
      },
      {
        checked: false,
        label: 'Society, politics and education',
        value: 'society-politics-and-education',
      },
      {
        checked: false,
        label: 'Science and technology',
        value: 'science-and-technology',
      },
    ],
    labelText: 'Specialised Societies',
    name: 'specialised-societies',
  },
};
