/* eslint-disable @typescript-eslint/naming-convention */

import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { BasePayload } from 'payload';

// Lazy-load payload so Tenants hooks do not import
// payload.config during module init (circular import).
const getPayload = async (): Promise<BasePayload> => {
  const {
    getPayloadCached,
  } = await import('@/utilities/getPayloadCached');

  return getPayloadCached();
};

interface InterfaceAddDataForTenantProps {
  tenantId: string;
}

interface InterfaceAddDataForTenantReturnProps {
  errorPage: string;
  contentSnippets: string;
  consent: string;
  status: string;
  form: string;
}

type InterfaceAddDataForTenantReturnPropsWithTenant = {
  tenantId: string;
} & InterfaceAddDataForTenantReturnProps;

const addInitialDataGerman = async ({
  tenantId,
}: InterfaceAddDataForTenantProps): Promise<InterfaceAddDataForTenantReturnProps> => {
  const payload = await getPayload();

  // error page
  const errorPage = await payload.create({
    collection: 'errorPage',
    data: {
      _status: 'published',
      error400: {
        description: simpleRteConfig('Möglicherweise wurde sie entfernt, umbenannt oder die URL wurde falsch eingegeben.'),
        title: simpleRteConfig('Diese Seite wurde leider nicht gefunden'),
      },
      error500: {
        description: simpleRteConfig('Bitte probieren Sie es zu einem anderen Zeitpunkt noch einmal.'),
        title: simpleRteConfig('Diese Seite wurde leider nicht gefunden'),
      },
      homeButtonText: simpleRteConfig('Zur Startseite'),
      meta: {
        seo: {
          description: 'Seite wurde nicht gefunden',
          title: 'Fehlermeldung',
        },
      },
      tenant: tenantId,
    },
    locale: 'de',
  });

  // i18n data / content snippets
  const contentSnippets = await payload.create({
    collection: 'i18nGlobals',
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig('Text kopieren'),
        title: simpleRteConfig('Zitiervorschlag'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('Ich habe die Hinweise zum Datenschutz gelesen und akzeptiere sie.'),
          errorMessage: simpleRteConfig('Bitte akzeptieren Sie die Datenschutzrichtlinien.'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('Downloads'),
        exportArticleButtonText: simpleRteConfig('Artikel exportieren'),
        linksTitle: simpleRteConfig('Links'),
        time: simpleRteConfig('Uhr'),
        writeEmailButtonText: simpleRteConfig('E-Mail schreiben'),
      },
      tenant: tenantId,
    },
    locale: 'de',
  });

  // consent data
  const consent = await payload.create({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonCustomizeSelection: simpleRteConfig('Auswahl anpassen'),
        buttonDeclineAll: simpleRteConfig('Alle ablehnen'),
        text: simpleRteConfig('Wir verwenden Cookies, um Ihnen ein optimales Erlebnis zu bieten. Lesen Sie unsere Datenschutzrichtlinien für weitere Informationen.'),
        title: simpleRteConfig('Diese Webseite verwendet Cookies'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('Diese Cookies nutzen wir für das Tracking des Nutzer·innenverhaltens. Die Analyse hilft uns dabei, die Webseite stetig zu verbessern.'),
          title: simpleRteConfig('Analytics und Performance'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('aus'),
          toggleLabelOn: simpleRteConfig('an'),
        },
        buttonAcceptAll: simpleRteConfig('Alle zulassen'),
        buttonAcceptSelection: simpleRteConfig('Auswahl anpassen'),
        externalContent: {
          text: simpleRteConfig('Externe Inhalte umfassen Cookies, die von Drittanbietern gesetzt werden, damit wir Inhalte von deren Plattformen auf unserer Website bereitstellen können (wie z.B. Videos oder Social Media Feeds).'),
          title: simpleRteConfig('Externe Inhalte'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('aus'),
          toggleLabelOn: simpleRteConfig('an'),
        },
        necessaryCookies: {
          text: simpleRteConfig('Diese Cookies sind notwendig für die grundlegenden Funktionen der Website. Sie können daher nicht deaktiviert werden.'),
          title: simpleRteConfig('Notwendige Cookies'),
          toggleLabel: simpleRteConfig('Immer an'),
        },
        text: simpleRteConfig('Sie haben die volle Kontrolle über Ihre Privatsphäre und entscheiden selbst, welche Cookies wir verwenden dürfen und welche nicht.'),
        title: simpleRteConfig('Cookies-Einstellungen'),
      },
      tenant: tenantId,
    },
    locale: 'de',
  });

  // status message
  const status = await payload.create({
    collection: 'statusMessage',
    data: {
      content: {
        message: simpleRteConfig('Wir arbeiten bereits an einer Lösung. Bitte entschuldigen Sie die Unannehmlichkeiten und versuchen Sie es später noch einmal.'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('Das System ist aktuell nicht verfügbar'),
        type: 'warn',
      },
      tenant: tenantId,
    },
    locale: 'de',
  });

  // contact form
  const form = await payload.create({
    collection: 'forms',
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'textBlockForm',
          fieldError: simpleRteConfig('Geben Sie Ihren Vor- und Nachnamen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Vor- und Nachname'),
          name: 'vor-und-nachname',
          placeholder: 'Ihr Vor- und Nachname',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('Geben Sie Ihre E-Mail-Adresse an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('E-Mail'),
          name: 'e-mail',
          placeholder: 'Ihre E-Mail-Adresse',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('Geben Sie eine Nachricht ein.'),
          fieldWidth: 'full',
          label: simpleRteConfig('Nachricht'),
          name: 'nachricht',
          placeholder: 'Ihre Nachricht',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Neue Nachricht via Kontaktformular',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Nachricht senden',
      submitError: {
        text: simpleRteConfig('Bitte laden Sie die Seite neu und versuchen Sie es noch einmal. Oder schreiben Sie uns eine E-Mail.'),
        title: simpleRteConfig('Das hat leider nicht geklappt!'),
      },
      submitSuccess: {
        text: simpleRteConfig('Wir haben Ihre Nachricht erhalten und melden uns zeitnah bei Ihnen.'),
        title: simpleRteConfig('Vielen Dank!'),
      },
      subtitle: simpleRteConfig('Haben Sie Fragen? Nehmen Sie mit uns Kontakt auf.'),
      tenant: tenantId,
      title: simpleRteConfig('Kontakt'),
    },
    locale: 'de',
  });

  return {
    consent: consent.id,
    contentSnippets: contentSnippets.id,
    errorPage: errorPage.id,
    form: form.id,
    status: status.id,
  };
};

const addInitialDataFrench = async ({
  tenantId,
  errorPage,
  contentSnippets,
  consent,
  status,
  form,
}: InterfaceAddDataForTenantReturnPropsWithTenant): Promise<void> => {
  const payload = await getPayload();

  // error page
  await payload.update({
    collection: 'errorPage',
    data: {
      _status: 'published',
      error400: {
        description: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      error500: {
        description: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      homeButtonText: simpleRteConfig('foo'),
      meta: {
        seo: {
          description: 'foo',
          title: 'foo',
        },
      },
      tenant: tenantId,
    },
    id: errorPage,
    locale: 'fr',
  });

  // i18n data / content snippets
  await payload.update({
    collection: 'i18nGlobals',
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('foo'),
          errorMessage: simpleRteConfig('foo'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('foo'),
        exportArticleButtonText: simpleRteConfig('foo'),
        linksTitle: simpleRteConfig('foo'),
        time: simpleRteConfig('foo'),
        writeEmailButtonText: simpleRteConfig('foo'),
      },
      tenant: tenantId,
    },
    id: contentSnippets,
    locale: 'fr',
  });

  // consent data
  await payload.update({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('foo'),
        buttonCustomizeSelection: simpleRteConfig('foo'),
        buttonDeclineAll: simpleRteConfig('foo'),
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('foo'),
          toggleLabelOn: simpleRteConfig('foo'),
        },
        buttonAcceptAll: simpleRteConfig('foo'),
        buttonAcceptSelection: simpleRteConfig('foo'),
        externalContent: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('foo'),
          toggleLabelOn: simpleRteConfig('foo'),
        },
        necessaryCookies: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleLabel: simpleRteConfig('foo'),
        },
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      tenant: tenantId,
    },
    id: consent,
    locale: 'fr',
  });

  // status message
  await payload.update({
    collection: 'statusMessage',
    data: {
      content: {
        message: simpleRteConfig('foo'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('foo'),
        type: 'warn',
      },
      tenant: tenantId,
    },
    id: status,
    locale: 'fr',
  });

  // contact form
  await payload.update({
    collection: 'forms',
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'textBlockForm',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'half',
          label: simpleRteConfig('foo1'),
          name: 'foo1',
          placeholder: 'foo',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'half',
          label: simpleRteConfig('foo2'),
          name: 'foo2',
          placeholder: 'foo',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'full',
          label: simpleRteConfig('foo3'),
          name: 'foo3',
          placeholder: 'foo',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'foo',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'foo',
      submitError: {
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      submitSuccess: {
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      subtitle: simpleRteConfig('foo'),
      tenant: tenantId,
      title: simpleRteConfig('foo'),
    },
    id: form,
    locale: 'fr',
  });

};

const addInitialDataItalian = async ({
  tenantId,
  errorPage,
  contentSnippets,
  consent,
  status,
  form,
}: InterfaceAddDataForTenantReturnPropsWithTenant): Promise<void> => {
  const payload = await getPayload();

  // error page
  await payload.update({
    collection: 'errorPage',
    data: {
      _status: 'published',
      error400: {
        description: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      error500: {
        description: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      homeButtonText: simpleRteConfig('foo'),
      meta: {
        seo: {
          description: 'foo',
          title: 'foo',
        },
      },
      tenant: tenantId,
    },
    id: errorPage,
    locale: 'it',
  });

  // i18n data / content snippets
  await payload.update({
    collection: 'i18nGlobals',
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('foo'),
          errorMessage: simpleRteConfig('foo'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('foo'),
        exportArticleButtonText: simpleRteConfig('foo'),
        linksTitle: simpleRteConfig('foo'),
        time: simpleRteConfig('foo'),
        writeEmailButtonText: simpleRteConfig('foo'),
      },
      tenant: tenantId,
    },
    id: contentSnippets,
    locale: 'it',
  });

  // consent data
  await payload.update({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('foo'),
        buttonCustomizeSelection: simpleRteConfig('foo'),
        buttonDeclineAll: simpleRteConfig('foo'),
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('foo'),
          toggleLabelOn: simpleRteConfig('foo'),
        },
        buttonAcceptAll: simpleRteConfig('foo'),
        buttonAcceptSelection: simpleRteConfig('foo'),
        externalContent: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('foo'),
          toggleLabelOn: simpleRteConfig('foo'),
        },
        necessaryCookies: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleLabel: simpleRteConfig('foo'),
        },
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      tenant: tenantId,
    },
    id: consent,
    locale: 'it',
  });

  // status message
  await payload.update({
    collection: 'statusMessage',
    data: {
      content: {
        message: simpleRteConfig('foo'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('foo'),
        type: 'warn',
      },
      tenant: tenantId,
    },
    id: status,
    locale: 'it',
  });

  // contact form
  await payload.update({
    collection: 'forms',
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'textBlockForm',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'half',
          label: simpleRteConfig('foo1'),
          name: 'foo1',
          placeholder: 'foo',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'half',
          label: simpleRteConfig('foo2'),
          name: 'foo2',
          placeholder: 'foo',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'full',
          label: simpleRteConfig('foo3'),
          name: 'foo3',
          placeholder: 'foo',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'foo',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'foo',
      submitError: {
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      submitSuccess: {
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      subtitle: simpleRteConfig('foo'),
      tenant: tenantId,
      title: simpleRteConfig('foo'),
    },
    id: form,
    locale: 'it',
  });
};

const addInitialDataEnglish = async ({
  tenantId,
  errorPage,
  contentSnippets,
  consent,
  status,
  form,
}: InterfaceAddDataForTenantReturnPropsWithTenant): Promise<void> => {
  const payload = await getPayload();

  // error page
  await payload.update({
    collection: 'errorPage',
    data: {
      _status: 'published',
      error400: {
        description: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      error500: {
        description: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      homeButtonText: simpleRteConfig('foo'),
      meta: {
        seo: {
          description: 'foo',
          title: 'foo',
        },
      },
      tenant: tenantId,
    },
    id: errorPage,
    locale: 'en',
  });

  // i18n data / content snippets
  await payload.update({
    collection: 'i18nGlobals',
    data: {
      bibliographicReference: {
        copyButtonText: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('foo'),
          errorMessage: simpleRteConfig('foo'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('foo'),
        exportArticleButtonText: simpleRteConfig('foo'),
        linksTitle: simpleRteConfig('foo'),
        time: simpleRteConfig('foo'),
        writeEmailButtonText: simpleRteConfig('foo'),
      },
      tenant: tenantId,
    },
    id: contentSnippets,
    locale: 'en',
  });

  // consent data
  await payload.update({
    collection: 'consent',
    data: {
      banner: {
        buttonAcceptAll: simpleRteConfig('foo'),
        buttonCustomizeSelection: simpleRteConfig('foo'),
        buttonDeclineAll: simpleRteConfig('foo'),
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('foo'),
          toggleLabelOn: simpleRteConfig('foo'),
        },
        buttonAcceptAll: simpleRteConfig('foo'),
        buttonAcceptSelection: simpleRteConfig('foo'),
        externalContent: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('foo'),
          toggleLabelOn: simpleRteConfig('foo'),
        },
        necessaryCookies: {
          text: simpleRteConfig('foo'),
          title: simpleRteConfig('foo'),
          toggleLabel: simpleRteConfig('foo'),
        },
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      tenant: tenantId,
    },
    id: consent,
    locale: 'en',
  });

  // status message
  await payload.update({
    collection: 'statusMessage',
    data: {
      content: {
        message: simpleRteConfig('foo'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('foo'),
        type: 'warn',
      },
      tenant: tenantId,
    },
    id: status,
    locale: 'en',
  });

  // contact form
  await payload.update({
    collection: 'forms',
    data: {
      colorMode: 'dark',
      fields: [
        {
          blockType: 'textBlockForm',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'half',
          label: simpleRteConfig('foo1'),
          name: 'foo1',
          placeholder: 'foo',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'half',
          label: simpleRteConfig('foo2'),
          name: 'foo2',
          placeholder: 'foo',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('foo'),
          fieldWidth: 'full',
          label: simpleRteConfig('foo3'),
          name: 'foo3',
          placeholder: 'foo',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'foo',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'foo',
      submitError: {
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      submitSuccess: {
        text: simpleRteConfig('foo'),
        title: simpleRteConfig('foo'),
      },
      subtitle: simpleRteConfig('foo'),
      tenant: tenantId,
      title: simpleRteConfig('foo'),
    },
    id: form,
    locale: 'en',
  });
};

export const tenantInitialData = async (props: InterfaceAddDataForTenantProps): Promise<void> => {

  try {
    const {
      consent,
      contentSnippets,
      errorPage,
      form,
      status,
    } = await addInitialDataGerman(props);

    await addInitialDataFrench({
      consent,
      contentSnippets,
      errorPage,
      form,
      status,
      tenantId: props.tenantId,
    });

    await addInitialDataItalian({
      consent,
      contentSnippets,
      errorPage,
      form,
      status,
      tenantId: props.tenantId,
    });

    await addInitialDataEnglish({
      consent,
      contentSnippets,
      errorPage,
      form,
      status,
      tenantId: props.tenantId,
    });

  } catch (err) {
    console.error('Error creating tenantInitialData.');
    console.log(err);
  }
};
