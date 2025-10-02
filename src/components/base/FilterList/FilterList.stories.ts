import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FilterList } from '@/components/base/FilterList/FilterList';
import { defaultDecorator } from '@/storybook-helpers';

type FilterListProps = React.ComponentProps<typeof FilterList>;

type StrictStory = StoryObj<typeof FilterList> & {
  args: FilterListProps;
};

const meta: Meta<typeof FilterList> = {
  argTypes: {
    onValueChange: {
      action: 'value changed',
    },
  },
  args: {},
  component: FilterList,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/FilterList',
};

export default meta;

export const PublicationOverviewFilters: StrictStory = {
  args: {
    filterListItems: [
      {
        filterItems: [
          {
            checked: true,
            label: 'All publication subjects',
            value: 'all',
          },
          {
            checked: false,
            label: 'Art, music and museums',
            value: 'art-music-and-museums',
          },
          {
            checked: false,
            label: 'Economics and law',
            value: 'economics-and-law',
          },
          {
            checked: false,
            label: 'History and archaeology',
            value: 'history-and-archaeology',
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
            label: 'Science and technology',
            value: 'science-and-technology',
          },
          {
            checked: false,
            label: 'Society, politics and education',
            value: 'society-politics-and-education',
          },
        ],
        labelText: 'Publication subjects',
        name: 'publication-subjects',
        type: 'staticSelect',
      },
      {
        filterItems: [
          {
            checked: true,
            label: 'All publication types',
            value: 'all',
          },
          {
            checked: false,
            label: 'Academic presentation',
            value: 'academic-presentation',
          },
          {
            checked: false,
            label: 'Annual report',
            value: 'annual-report',
          },
          {
            checked: false,
            label: 'Factsheet',
            value: 'factsheet',
          },
          {
            checked: false,
            label: 'Magazine',
            value: 'magazine',
          },
          {
            checked: false,
            label: 'Studies and reports',
            value: 'studies-and-reports',
          },
        ],
        labelText: 'Publication type',
        name: 'publication-type',
        type: 'staticSelect',
      },
    ],
  },
};
