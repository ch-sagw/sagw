import { FormBuilderPluginConfig } from 'node_modules/@payloadcms/plugin-form-builder/dist/types';
import { Field } from 'payload';

const makeButtonFieldRequired = (field: Field): void => {
  if ('name' in field && field.name === 'submitButtonLabel') {
    (field as any).required = true;
  }
};

const addPlaceholderAndErrorFieldsToFormBlocks = (field: Field): void => {
  if ('name' in field && 'blocks' in field && field.name === 'fields') {
    field.blocks.forEach((block) => {
      block.fields.push({
        localized: true,
        name: 'placeholder',
        required: true,
        type: 'text',
      });
      block.fields.push({
        admin: {
          condition: (_, siblingData) => siblingData.required === true,
        },
        localized: true,
        name: 'fieldError',
        required: true,
        type: 'text',
      });
    });
  }
};

const removeDefaultValueField = (field: Field): void => {
  if ('name' in field && 'blocks' in field && field.name === 'fields') {
    const fieldBlocks = field.blocks.map((block) => {
      const blockFields = block.fields.filter((blockField) => {
        // remove default value on checkbox block
        if ('name' in blockField && blockField.name === 'defaultValue') {
          return false;
        }

        // remove default value on other blocks
        if ('fields' in blockField) {
          const blockFieldsFields = blockField.fields.filter((fieldsField) => {
            if ('name' in fieldsField && fieldsField.name === 'defaultValue') {
              return false;
            }

            return true;
          });

          blockField.fields = blockFieldsFields;
        }

        return true;

      });

      block.fields = blockFields;

      return block;

    });

    field.blocks = fieldBlocks;

  }

};

export const formPluginConfig = (): FormBuilderPluginConfig => ({
  fields: {
    checkbox: true,
    country: false,
    date: false,
    email: true,
    message: false,
    number: false,
    payment: false,
    select: false,
    state: false,
    text: true,
    textarea: true,
  },
  formOverrides: {
    fields: ({
      defaultFields,
    }): Field[] => {
      const renderFields = defaultFields.filter((field) => 'name' in field && field.name !== 'redirect' && field.name !== 'confirmationType' && field.name !== 'emails' && field.name !== 'confirmationMessage');

      renderFields.map((field) => {
        makeButtonFieldRequired(field);
        addPlaceholderAndErrorFieldsToFormBlocks(field);
        removeDefaultValueField(field);

        return field;
      });

      renderFields.push({
        localized: true,
        name: 'recipientEMail',
        required: true,
        type: 'email',
      });

      renderFields.push({
        localized: true,
        name: 'successMessage',
        required: true,
        type: 'text',
      });

      renderFields.push({
        localized: true,
        name: 'errorMessage',
        required: true,
        type: 'text',
      });

      return renderFields;

    },
    slug: 'forms',
  },

  // TODO
  // is this the best way to hide the submissions collection?
  formSubmissionOverrides: {
    admin: {
      hidden: true,
    },
    slug: 'form-submissions',
  },
});
