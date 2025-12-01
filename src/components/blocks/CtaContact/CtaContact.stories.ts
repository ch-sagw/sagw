import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { CtaContact } from '@/components/blocks/CtaContact/CtaContact';
import { defaultDecorator } from '@/storybook-helpers';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { Person } from '@/payload-types';

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

const defaultContact: Person = {
  createdAt: '',
  firstname: simpleRteConfig('Julie'),
  fullName: 'Julie Zing',
  function: simpleRteConfig('Wissenschaftliche Mitarbeiterin'),
  id: '1',
  lastname: simpleRteConfig('Zing'),
  mail: 'foo@bar.com',
  phone: '+41 (0)31 333 44 55',
  updatedAt: '',
};

export const SingleContact: StrictStory = {
  args: {
    blockType: 'ctaContactBlock',
    buttonText: simpleRteConfig('E-Mail scrheiben'),
    colorMode: 'dark',
    contact: [defaultContact],
    pageLanguage: 'de',
    text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
    title: simpleRteConfig('Kontakt'),
  },
};

export const MultipleContacts: StrictStory = {
  args: {
    blockType: 'ctaContactBlock',
    buttonText: simpleRteConfig('E-Mail scrheiben'),
    colorMode: 'dark',
    contact: [
      defaultContact,
      {
        ...defaultContact,
        id: '2',
      },
    ],
    pageLanguage: 'de',
    text: simpleRteConfig('Haben Sie Fragen? Dann melden Sie sich gerne bei uns.'),
    title: simpleRteConfig('Kontakt'),
  },
};
