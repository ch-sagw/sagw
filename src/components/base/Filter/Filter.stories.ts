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

export const TransformativeSelectToRadios: StrictStory = {
  args: {
    filterItems: [
      {
        checked: true,
        label: 'All specialised societies',
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
    type: 'transformativeSelect',
  },
};

export const TransformativeSelectToRadiosWithAmounts: StrictStory = {
  args: {
    filterItems: [
      {
        amount: 234,
        checked: true,
        label: 'All specialised societies',
        value: 'all',
      },
      {
        amount: 34,
        checked: false,
        label: 'History and archaeology',
        value: 'history-and-archaeology',
      },
      {
        amount: 58,
        checked: false,
        label: 'Art, music and museums',
        value: 'art-music-and-mueseums',
      },
      {
        amount: 42,
        checked: false,
        label: 'Language and literature',
        value: 'language-and-literature',
      },
      {
        amount: 33,
        checked: false,
        label: 'Philosophy, cultures and religions',
        value: 'philosophy-cultures-and-religions',
      },
      {
        amount: 19,
        checked: false,
        label: 'Economics and law',
        value: 'economics-and-law',
      },
      {
        amount: 7,
        checked: false,
        label: 'Society, politics and education',
        value: 'society-politics-and-education',
      },
      {
        amount: 41,
        checked: false,
        label: 'Science and technology',
        value: 'science-and-technology',
      },
    ],
    labelText: 'Specialised Societies',
    name: 'specialised-societies',
    type: 'transformativeSelect',
  },
};

export const StaticSelect: StrictStory = {
  args: {
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
};

export const StaticSelectWithAmounts: StrictStory = {
  args: {
    filterItems: [
      {
        amount: 112,
        checked: true,
        label: 'All publication types',
        value: 'all',
      },
      {
        amount: 34,
        checked: false,
        label: 'Academic presentation',
        value: 'academic-presentation',
      },
      {
        amount: 8,
        checked: false,
        label: 'Annual report',
        value: 'annual-report',
      },
      {
        amount: 29,
        checked: false,
        label: 'Factsheet',
        value: 'factsheet',
      },
      {
        amount: 27,
        checked: false,
        label: 'Magazine',
        value: 'magazine',
      },
      {
        amount: 14,
        checked: false,
        label: 'Studies and reports',
        value: 'studies-and-reports',
      },
    ],
    labelText: 'Publication type',
    name: 'publication-type',
    type: 'staticSelect',
  },
};

