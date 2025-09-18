import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { Form } from '@/components/blocks/Form/Form';
import { defaultDecorator } from '@/storybook-helpers';

type FormProps = React.ComponentProps<typeof Form>;

type StrictStory = StoryObj<typeof Form> & {
  args: FormProps;
};

const meta: Meta<typeof Form> = {
  args: {},
  component: Form,
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

export const SampleStory: StrictStory = {
  args: {

    blockType: 'formBlock',
    form: {
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
      title: 'Form SAGW',
      updatedAt: '2025-09-14T15:43:50.512Z',
    },
    id: '68c6e3e422861b09d2c342b3',

  },
};
