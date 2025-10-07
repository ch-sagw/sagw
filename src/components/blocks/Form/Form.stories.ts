import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FormComponent } from '@/components/blocks/Form/Form.component';
import { defaultDecorator } from '@/storybook-helpers';
import { sampleRtePrivacyCheckbox } from '@/components/base/Rte/Rte.sampleContent';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

type FormProps = React.ComponentProps<typeof FormComponent>;

type StrictStory = StoryObj<typeof FormComponent> & {
  args: FormProps;
};

const meta: Meta<typeof FormComponent> = {
  args: {},
  component: FormComponent,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'visual:check',
    'a11y:check',
  ],
  title: 'Components/blocks/Form',
};

export default meta;

const defaultFormConfig: FormProps = {
  action: () => {
    console.log('some submit action');
  },
  errors: {},
  firstErrorFieldName: '',
  form: {
    colorMode: 'dark',
    createdAt: '2025-09-14T15:43:50.512Z',
    fields: [
      {
        blockType: 'textBlockForm',
        fieldError: simpleRteConfig('Field error SAGW'),
        fieldWidth: 'half',
        id: '68c6e2b6833c54485eb1b84c',
        label: simpleRteConfig('Text field label SAGW'),
        name: 'field1',
        placeholder: 'Text field placeholder SAGW',
        required: true,
      },
      {
        blockType: 'textBlockForm',
        fieldError: simpleRteConfig('Field error SAGW'),
        fieldWidth: 'half',
        id: '68c6e2b6833c54485eb1b84c',
        label: simpleRteConfig('Text field label SAGW'),
        name: 'field2',
        placeholder: 'Text field placeholder SAGW',
        required: true,
      },
      {
        blockType: 'checkboxBlock',
        fieldError: simpleRteConfig('checkbox error'),
        fieldWidth: 'half',
        id: '69c6e2b6833c54485eb1b84c',
        label: sampleRtePrivacyCheckbox,
        name: 'checkbox1',
        required: true,
      },
      {
        blockType: 'checkboxBlock',
        fieldError: simpleRteConfig('checkbox error'),
        fieldWidth: 'half',
        id: '67c6e2b6833c54485eb1b84c',
        label: sampleRtePrivacyCheckbox,
        name: 'checkbox2',
        required: false,
      },
      {
        blockType: 'emailBlock',
        fieldError: simpleRteConfig('Geben Sie eine E-Mail Adresse an'),
        fieldWidth: 'half',
        id: '66c6e2b6833c54485eb1b84c',
        label: simpleRteConfig('E-Mail'),
        name: 'email',
        placeholder: 'Ihre E-Mail Adresse',
        required: true,
      },
      {
        blockType: 'textareaBlock',
        fieldError: simpleRteConfig('Geben Sie einen Kommentar an.'),
        fieldWidth: 'full',
        id: '65c6e2b6833c54485eb1b84c',
        label: simpleRteConfig('Kommentar'),
        name: 'textarea',
        placeholder: 'Ihr Kommentar',
        required: true,
      },
    ],
    id: '68c6e2b6ec3710c8de69135e',
    isNewsletterForm: 'custom',
    newsletterFields: {
      actionText: 'Erneut senden',
      email: {
        fieldWidth: 'full',
        label: simpleRteConfig('foo'),
        placeholder: 'baz',
      },
      name: {
        fieldWidth: 'full',
        label: simpleRteConfig('foo'),
        placeholder: 'baz',
      },
    },
    recipientMail: 'foo@bar.baz',
    showPrivacyCheckbox: true,
    submitButtonLabel: 'Submit button SAGW',
    submitError: {
      optionalLink: {
        includeLink: false,

        link: {
          internalLink: '/',
          linkText: simpleRteConfig('foo'),
        },
      },
      text: simpleRteConfig('submit error text'),
      title: simpleRteConfig('submit error title'),
    },
    submitSuccess: {
      optionalLink: {
        includeLink: false,

        link: {
          internalLink: '/',
          linkText: simpleRteConfig('foo'),
        },
      },
      text: simpleRteConfig('submit success text'),
      title: simpleRteConfig('submit success title'),
    },
    subtitle: simpleRteConfig('Erhalten Sie Updates zu aktuellen Projekten, Artikel, Publikationen und Veranstaltungen'),
    tenant: '68c6e2b3ec3710c8de6912f8',
    title: simpleRteConfig('Form SAGW'),
    titleLevel: '2',
    updatedAt: '2025-09-14T15:43:50.512Z',
  },
  pending: false,
  state: null,
  submitError: false,
  submitSuccess: false,

};

export const FormDark: StrictStory = {
  args: defaultFormConfig,
};

export const FormWhite: StrictStory = {
  args: {
    ...defaultFormConfig,
    form: {
      ...(defaultFormConfig.form as Exclude<FormProps['form'], string | null | undefined>),
      colorMode: 'white',
    },
  },
};

export const FormLight: StrictStory = {
  args: {
    ...defaultFormConfig,
    form: {
      ...(defaultFormConfig.form as Exclude<FormProps['form'], string | null | undefined>),
      colorMode: 'light',
    },
  },
};

export const SubmitSuccess: StrictStory = {
  args: {
    ...defaultFormConfig,
    submitSuccess: true,
  },
};

export const SubmitError: StrictStory = {
  args: {
    ...defaultFormConfig,
    submitError: true,
  },
};

export const FieldErrors: StrictStory = {
  args: {
    ...defaultFormConfig,
    errors: {
      checkbox1: ['Error on checkbox 1'],
      checkbox2: ['Error on checkbox 2'],
      email: ['Error on email'],
      field1: ['Error on text field 1'],
      field2: ['Error on text field 2'],
      textarea: ['Error on textarea'],
    },
  },
};

export const PendingState: StrictStory = {
  args: {
    ...defaultFormConfig,
    pending: true,
  },
};

