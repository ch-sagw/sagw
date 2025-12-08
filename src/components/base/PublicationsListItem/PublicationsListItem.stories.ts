import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { PublicationsListItem } from '@/components/base/PublicationsListItem/PublicationsListItem';
import { InterfaceImagePropTypes } from '@/components/base/Image/Image';
import { defaultDecorator } from '@/storybook-helpers';

type PublicationsListItemProps = React.ComponentProps<typeof PublicationsListItem>;

type StrictStory = StoryObj<typeof PublicationsListItem> & {
  args: PublicationsListItemProps;
};

const meta: Meta<typeof PublicationsListItem> = {
  args: {},
  component: PublicationsListItem,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/base/PublicationsListItem',
};

export default meta;

const image = {
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
};

export const Full: StrictStory = {
  args: {
    date: '2025-10-23T12:00:00.000Z',
    image,
    link: {
      href: 'https://foo.bar',
    },
    tag: 'Magazin',
    title: 'Das Paradox von sozialer Integration und Ausschluss im Schweizer Bildungswesen. Beiträge der Soziologie',
  },
};

export const NoTag: StrictStory = {
  args: {
    date: '2026-04-11T12:00:00.000Z',
    image,
    link: {
      href: 'https://foo.bar',
    },
    tag: '',
    title: 'Bulletin 1/25: Intelligenz',
  },
};

