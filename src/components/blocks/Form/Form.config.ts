// the hidden input we ship to the client must never include the form
// definition (recipient mail, list ids, field list, subject, etc.). We
// only submit a stable form id. `submitForm` refetches the authoritative
// definition server-side via the Payload Local API.
export const hiddenFormIdFieldName = 'formId';
export const hiddenPageUrl = 'pageUrl';

// Server actions may not receive next-intl's request locale (no middleware /
// header on the POST). Field `name` values are localized, so we submit the
// active UI locale and validate it server-side against `routing.locales`.
export const hiddenFormLocaleFieldName = 'formLocale';

// newsletter forms do not store their user-facing fields as form.fields
// in payload. These names are used by both the renderer (to build the
// inputs) and the server action (to read values from the submitted
// FormData). Keep the two in sync.
export const newsletterFieldNames = {
  email: 'email',
  firstname: 'firstname',
  language: 'language',
  lastname: 'lastname',
} as const;
