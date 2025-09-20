import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { FormComponent } from '@/components/blocks/Form/Form.component';
import { defaultDecorator } from '@/storybook-helpers';
import { sampleRtePrivacyCheckbox } from '@/components/base/Rte/Rte.sampleContent';

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

const formConfigDark: FormProps = {
  action: () => {
    console.log('some submit action');
  },
  errors: {},
  firstErrorFieldName: '',
  form: {
    colorMode: 'dark',
    createdAt: '2025-09-14T15:43:50.512Z',
    department: '68c6e2b3ec3710c8de6912f8',
    fields: [
      {
        blockType: 'textBlockForm',
        fieldError: 'Field error SAGW',
        fieldWidth: 'half',
        id: '68c6e2b6833c54485eb1b84c',
        label: 'Text field label SAGW',
        name: 'Text field name SAGW',
        placeholder: 'Text field placeholder SAGW',
        required: true,
      },
      {
        blockType: 'textBlockForm',
        fieldError: 'Field error SAGW',
        fieldWidth: 'half',
        id: '68c6e2b6833c54485eb1b84c',
        label: 'Text field label SAGW',
        name: 'Text field name SAGW',
        placeholder: 'Text field placeholder SAGW',
        required: true,
      },
      {
        blockType: 'checkboxBlock',
        fieldError: 'checkbox error',
        fieldWidth: 'half',
        id: '69c6e2b6833c54485eb1b84c',
        label: {
          content: sampleRtePrivacyCheckbox,
        },
        name: 'checkbox',
        required: true,
      },
      {
        blockType: 'checkboxBlock',
        fieldError: 'checkbox error',
        fieldWidth: 'half',
        id: '67c6e2b6833c54485eb1b84c',
        label: {
          content: sampleRtePrivacyCheckbox,
        },
        name: 'checkbox',
        required: false,
      },
      {
        blockType: 'emailBlock',
        fieldError: 'Geben Sie eine E-Mail Adresse an',
        fieldWidth: 'half',
        id: '66c6e2b6833c54485eb1b84c',
        label: 'E-Mail',
        name: 'email',
        placeholder: 'Ihre E-Mail Adresse',
        required: true,
      },
      {
        blockType: 'textareaBlock',
        fieldError: 'Geben Sie einen Kommentar an.',
        fieldWidth: 'full',
        id: '65c6e2b6833c54485eb1b84c',
        label: 'Kommentar',
        name: 'textarea',
        placeholder: 'Ihr Kommentar',
        required: true,
      },
    ],
    id: '68c6e2b6ec3710c8de69135e',
    isNewsletterForm: 'custom',
    newsletterForm: {
      emailField: {
        fieldWidth: 'full',
        label: 'foo',
        name: 'bar',
        placeholder: 'baz',
      },
      textField: {
        fieldWidth: 'full',
        label: 'foo',
        name: 'bar',
        placeholder: 'baz',
      },
    },
    recipientMail: 'foo@bar.baz',
    showPrivacyCheckbox: true,
    submitButtonLabel: 'Submit button SAGW',
    subtitle: 'Erhalten Sie Updates zu aktuellen Projekten, Artikel, Publikationen und Veranstaltungen',
    title: 'Form SAGW',
    titleLevel: '2',
    updatedAt: '2025-09-14T15:43:50.512Z',
  },
  i18n: {
    dataPrivacyCheckbox: {
      dataPrivacyCheckboxText: {
        content: sampleRtePrivacyCheckbox,
      },
      errorMessage: 'Foo bas',
    },
    submitError: {
      optionalLink: {
        includeLink: false,

        link: {
          internalLink: '/',
          linkText: 'foo',
          openInNewWindow: false,
        },
      },
      text: 'Submit text error SAGW',
      title: 'Submit title error SAGW',
    },
    submitSuccess: {
      optionalLink: {
        includeLink: false,
        link: {
          internalLink: '/',
          linkText: 'foo',
          openInNewWindow: false,
        },
      },
      text: 'Submit text success SAGW',
      title: 'Submit title success SAGW',
    },
    submitWarn: {
      optionalLink: {
        includeLink: false,
        link: {
          internalLink: '/',
          linkText: 'foo',
          openInNewWindow: false,
        },
      },
      text: 'Submit text warn SAGW',
      title: 'Submit title warn SAGW',

    },
  },
  pending: false,
  state: null,
  submitError: false,
  submitSuccess: false,

};

const formConfigWhite: FormProps = {
  ...formConfigDark,
  form: {
    ...(formConfigDark.form as Exclude<FormProps['form'], string | null | undefined>),
    colorMode: 'white',
  },
};

export const FormDark: StrictStory = {
  args: formConfigDark,
};

export const FormWhite: StrictStory = {
  args: formConfigWhite,
};
