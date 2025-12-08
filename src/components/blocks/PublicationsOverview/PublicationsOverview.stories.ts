import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsOverviewComponent } from '@/components/blocks/PublicationsOverview/PublicationsOverview.component';
import { PublicationOverviewFilters } from '@/components/base/FilterList/FilterList.stories';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
import { defaultDecoratorNoPadding } from '@/storybook-helpers';

type PublicationsOverviewProps = React.ComponentProps<typeof PublicationsOverviewComponent>;

type StrictStory = StoryObj<typeof PublicationsOverviewComponent> & {
  args: PublicationsOverviewProps;
};

const meta: Meta<typeof PublicationsOverviewComponent> = {
  args: {},
  component: PublicationsOverviewComponent,
  decorators: [defaultDecoratorNoPadding],
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
  title: 'Components/blocks/PublicationsOverview',
};

export default meta;

const publicationItem = {
  date: '2025-10-23T12:00:00.000Z',
  image: {
    alt: 'SAGW image',
    createdAt: '2025-12-02T16:29:03.337Z',
    filename: 'sagw.png',
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
    url: 'https://sagw-nu-localhost.gumlet.io/sagw.png',
    variant: 'publicationTeaser' as InterfaceImagePropTypes['variant'],
    width: 2048,
  },
  link: {
    href: 'https://foo.bar',
  },
  tag: 'Magazin',
  title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
};

export const LotsOfItems: StrictStory = {
  args: {
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    items: Array.from({
      length: 25,
    }, () => publicationItem),
    notification: {
      text: 'Alle Publikationen, die im Jahr 2019 oder früher publiziert wurden, sind auf <a href="https://zenodo.org/communities/sagw/records" target="_blank">Zenodo</a> zu finden.',
      title: '',
    },
    paginationTitle: 'Pagination',
    title: 'Publikationen',
  },
};

export const FewItems: StrictStory = {
  args: {
    colorMode: 'white',
    filters: {
      filterListItems: PublicationOverviewFilters.args.filterListItems,
    },
    items: Array.from({
      length: 6,
    }, () => publicationItem),
    notification: {
      text: 'Alle Publikationen, die im Jahr 2019 oder früher publiziert wurden, sind auf <a href="https://zenodo.org/communities/sagw/records" target="_blank">Zenodo</a> zu finden.',
      title: '',
    },
    paginationTitle: 'Pagination',
    title: 'Latest News',
  },
};
