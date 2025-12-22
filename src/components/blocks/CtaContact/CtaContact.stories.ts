import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { CtaContact } from '@/components/blocks/CtaContact/CtaContact';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import {
  Image,
  Person,
} from '@/payload-types';

type CtaContactProps = React.ComponentProps<typeof CtaContact>;

type StrictStory = StoryObj<typeof CtaContact> & {
  args: CtaContactProps;
};

const meta: Meta<typeof CtaContact> = {
  args: {},
  component: CtaContact,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/CtaContact',
};

export default meta;

const imageConfig: Image = {
  alt: 'Astronaut Robert L. Stewart, mission specialist, participates in a extravehicular activity (EVA), a few meters away from the cabin of the Space Shuttle Challenger. Stewart is centered in a background of clouds and earth in this view of his EVA. He is floating without tethers attaching him to the shuttle.',
  createdAt: '2025-11-19T09:54:49.430Z',
  filename: '20071445109_e1a2b79633_6k.jpg',
  focalX: 55,
  focalY: 45,
  height: 4219,
  id: '691d93e9d438ebb73a571f86',
  updatedAt: '2025-11-19T09:54:49.431Z',
  // The url value coming from Payload will not contain the hostname.
  // It is added here for Storybook only.
  url: 'https://sagw-nu-localhost.gumlet.io/20071445109_e1a2b79633_6k.jpg',
  width: 5742,
};

const defaultContact: Person = {
  createdAt: '',
  firstname: simpleRteConfig('Julie'),
  fullName: 'Julie Zing',
  function: simpleRteConfig('Wissenschaftliche Mitarbeiterin'),
  id: '1',
  image: imageConfig,
  lastname: simpleRteConfig('Zing'),
  mail: 'foo@bar.com',
  phone: '+41 (0)31 333 44 55',
  updatedAt: '',
};

export const SingleContact: StrictStory = {
  args: {
    blockType: 'ctaContactBlock',
    buttonText: simpleRteConfig('E-Mail schreiben'),
    colorMode: 'dark',
    contact: [defaultContact],
    text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
    title: simpleRteConfig('Kontakt'),
  },
};

export const MultipleContacts: StrictStory = {
  args: {
    blockType: 'ctaContactBlock',
    buttonText: simpleRteConfig('E-Mail schreiben'),
    colorMode: 'dark',
    contact: [
      defaultContact,
      {
        ...defaultContact,
        id: '2',
      },
    ],
    text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
    title: simpleRteConfig('Kontakt'),
  },
};
