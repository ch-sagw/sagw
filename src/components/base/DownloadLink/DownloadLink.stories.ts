import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { DownloadLink } from '@/components/base/DownloadLink/DownloadLink';
import { defaultDecorator } from '@/storybook-helpers';

type DownloadLinkProps = React.ComponentProps<typeof DownloadLink>;

type StrictStory = StoryObj<typeof DownloadLink> & {
  args: DownloadLinkProps;
};

const meta: Meta<typeof DownloadLink> = {
  args: {},
  component: DownloadLink,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/DownloadLink',
};

export default meta;

export const LongLinkText: StrictStory = {
  args: {
    file: {
      publicationDate: '17. Mai 2025',
      size: '4 MB',
      type: 'PDF',
    },
    linkTarget: 'https://www.sagw.ch/fileadmin/redaktion_sagw/dokumente/Publikationen/Bildung/Bernardi_Duchene_Heers_All-day_Childcare.pdf',
    linkText: 'Studie «All-day childcare and schooling: A survey of parental attitudes in Switzerland»',
  },
};
