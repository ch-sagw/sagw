import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverview } from '@/components/base/PublicationsOverview/PublicationsOverview';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
import { defaultDecorator } from '@/storybook-helpers';
import { ImageVariant } from '@/components/base/types/imageVariant';

type PublicationsOverviewProps = React.ComponentProps<typeof PublicationsOverview>;

type StrictStory = StoryObj<typeof PublicationsOverview> & {
  args: PublicationsOverviewProps;
};

const meta: Meta<typeof PublicationsOverview> = {
  args: {},
  component: PublicationsOverview,
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
  title: 'Components/base/PublicationsOverview',
};

export default meta;

const image = {
  alt: 'SAGW image',
  createdAt: '2025-12-02T16:29:03.337Z',
  filename: 'cover-sagw-bulletin-1-2022.jpg',
  filesize: 50757,
  focalX: 50,
  focalY: 50,
  height: 2048,
  id: '692f13cfef533bd5f1765988',
  loading: 'lazy' as InterfaceImagePropTypes['loading'],
  mimeType: 'image/png',
  tenant: '692f13cdef533bd5f1765954',
  thumbnailURL: null,
  updatedAt: '2025-12-02T16:29:03.337Z',
  url: 'https://sagw-nu-localhost.gumlet.io/cover-sagw-bulletin-1-2022.jpg',
  variant: 'publicationTeaser' as ImageVariant,
  width: 2048,
};

const filterListItems = [
  [
    {
      checked: true,
      label: 'Alle Publikationen',
      value: 'all',
    },
    {
      checked: false,
      label: 'Akademiereferate',
      value: '693b0993621d28f661711b4f',
    },
    {
      checked: false,
      label: 'Factsheets',
      value: '693b0993621d28f661711b50',
    },
    {
      checked: false,
      label: 'Jahresbericht',
      value: '693b0993621d28f661711b51',
    },
    {
      checked: false,
      label: 'Magazin',
      value: '693b0993621d28f661711b52',
    },
    {
      checked: false,
      label: 'Studien und Berichte',
      value: '693b0993621d28f661711b53',
    },
  ],
  [
    {
      checked: true,
      label: 'Alle Themen',
      value: 'all',
    },
    {
      checked: false,
      label: 'Bildung',
      value: '693b0993621d28f661711b48',
    },
    {
      checked: false,
      label: 'Demografischer Wandel',
      value: '693b0993621d28f661711b47',
    },
    {
      checked: false,
      label: 'Kultur und Gesellschaft',
      value: '693b0993621d28f661711b46',
    },
    {
      checked: false,
      label: 'Nachhaltigkeit',
      value: '693b0993621d28f661711b49',
    },
    {
      checked: false,
      label: 'Wissenschaftsbetrieb',
      value: '693b0993621d28f661711b45',
    },
  ],
];

export const Publications: StrictStory = {
  args: {
    colorMode: 'white',
    filterItems: filterListItems,
    notification: {
      text: 'Alle Publikationen, die im Jahr 2019 oder früher publiziert wurden, sind auf Zenodo zu finden.',
      title: '',
    },
    paginationTitle: 'Pagination',
    publicationItems: Array.from({
      length: 25,
    }, (_, index) => ({
      categorization: {
        topic: undefined,
        type: 'Magazin',
      },
      date: '2025-10-23T12:00:00.000Z',
      id: `publication-${index}`,
      image,
      link: {
        href: 'https://foo.bar',
      },
      tag: 'Magazin',
      title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
    })),
    title: 'Publikationen',
  },
};

export const PublicationsNoNotification: StrictStory = {
  args: {
    colorMode: 'white',
    filterItems: filterListItems,
    paginationTitle: 'Pagination',
    publicationItems: Array.from({
      length: 25,
    }, (_, index) => ({
      categorization: {
        topic: undefined,
        type: 'Magazin',
      },
      date: '2025-10-23T12:00:00.000Z',
      id: `publication-${index}`,
      image,
      link: {
        href: 'https://foo.bar',
      },
      tag: 'Magazin',
      title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
    })),
    title: 'Publikationen',
  },
};

