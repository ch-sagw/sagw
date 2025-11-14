import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Section } from '@/components/base/Section/Section';
import { PublicationOverviewFilters } from '@/components/base/FilterList/FilterList.stories';
import { defaultDecorator } from '@/storybook-helpers';

type SectionProps = React.ComponentProps<typeof Section>;

type StrictStory = StoryObj<typeof Section> & {
  args: SectionProps;
};

const meta: Meta<typeof Section> = {
  args: {},
  component: Section,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/Section',
};

export default meta;

export const DefaultSection: StrictStory = {
  args: {
    children: <p>some child content comes here...</p>,
    colorMode: 'light',
    showTopLine: true,
    subtitle: 'Subtitle',
    title: 'Section title',
  },
};

export const SectionWithFilters: StrictStory = {
  args: {
    children: <p>some child content comes here...</p>,
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    showTopLine: true,
    subtitle: 'Subtitle',
    title: 'Section title',
  },
};
