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
        description: simpleRteConfig('Elle a peut-être été supprimée ou renommée, ou l’URL saisie est incorrecte. Merci de réessayer d’y accéder plus tard.'),
        title: simpleRteConfig('La page recherchée est introuvable.'),
      },
      error500: {
        description: simpleRteConfig('Elle a peut-être été supprimée ou renommée, ou l’URL saisie est incorrecte. Merci de réessayer d’y accéder plus tard.'),
        title: simpleRteConfig('La page recherchée est introuvable.'),
      },
      homeButtonText: simpleRteConfig('Retour à l’accueil'),
      meta: {
        seo: {
          description: 'Page introuvable',
          title: 'Message d\'erreur',
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
        copyButtonText: simpleRteConfig('Copier le texte'),
        title: simpleRteConfig('Proposition de citation'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('J’ai lu et j’accepte les informations sur la protection des données.'),
          errorMessage: simpleRteConfig('Veuillez accepter les dispositions sur la protection des données.'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('Téléchargements'),
        exportArticleButtonText: simpleRteConfig('Exporter l’article'),
        linksTitle: simpleRteConfig('Liens'),
        time: simpleRteConfig('Heure'),
        writeEmailButtonText: simpleRteConfig('Écrire un e-mail'),
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
        buttonAcceptAll: simpleRteConfig('Tout autoriser'),
        buttonCustomizeSelection: simpleRteConfig('Modifier les choix'),
        buttonDeclineAll: simpleRteConfig('Tout refuser'),
        text: simpleRteConfig('Nous utilisons des cookies pour vous offrir une expérience optimale. Pour plus d’informations, merci de lire nos dispositions sur la protection des données.'),
        title: simpleRteConfig('Ce site web utilise des cookies.'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('Ces cookies nous permettent de comprendre l’utilisation qui est faite du site web. Cette analyse nous aide à améliorer le site web en continu.'),
          title: simpleRteConfig('Analyse et performance'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('Refuser'),
          toggleLabelOn: simpleRteConfig('Accepter'),
        },
        buttonAcceptAll: simpleRteConfig('Tout autoriser'),
        buttonAcceptSelection: simpleRteConfig('Modifier les choix'),
        externalContent: {
          text: simpleRteConfig('Les contenus externes incluent des cookies définis par des tiers afin que nous puissions proposer des contenus de leurs plateformes sur notre site web (p. ex. des vidéos ou des flux de réseaux sociaux).'),
          title: simpleRteConfig('Contenus externes'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('Refuser'),
          toggleLabelOn: simpleRteConfig('Accepter'),
        },
        necessaryCookies: {
          text: simpleRteConfig('Ces cookies sont nécessaires au bon fonctionnement du site web et ne peuvent donc pas être désactivés.'),
          title: simpleRteConfig('Cookies nécessaires'),
          toggleLabel: simpleRteConfig('Toujours activés'),
        },
        text: simpleRteConfig('Vous contrôlez totalement votre vie privée et décidez quels cookies nous pouvons utiliser, ou non.'),
        title: simpleRteConfig('Réglages des cookies'),
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
        message: simpleRteConfig('Le problème est déjà en cours de résolution. Veuillez nous excuser pour la gêne occasionnée et réessayer ultérieurement.'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('Le système n’est actuellement pas disponible.'),
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
          fieldError: simpleRteConfig('Veuillez saisir votre prénom et votre nom.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Prénom et nom'),
          name: 'prenom-et-nom',
          placeholder: 'Votre prénom et votre nom',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('Veuillez saisir votre adresse e-mail.'),
          fieldWidth: 'half',
          label: simpleRteConfig('E-mail'),
          name: 'e-mail',
          placeholder: 'Votre adresse e-mail',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('Veuillez saisir votre message.'),
          fieldWidth: 'full',
          label: simpleRteConfig('Message'),
          name: 'message',
          placeholder: 'Votre message',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Nouveau message via le site web',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Envoyer un message',
      submitError: {
        text: simpleRteConfig('Veuillez recharger la page et réessayer. Vous pouvez aussi nous écrire à sagw@sagw.ch'),
        title: simpleRteConfig('La requête n’a malheureusement pas abouti.'),
      },
      submitSuccess: {
        text: simpleRteConfig('Nous avons bien reçu votre message et nous vous répondrons rapidement'),
        title: simpleRteConfig('Merci !'),
      },
      subtitle: simpleRteConfig('Une question ? Contactez-nous !'),
      tenant: tenantId,
      title: simpleRteConfig('Contact'),
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
        description: simpleRteConfig('Potrebbe essere stata eliminata, rinominata o l’URL inserito non è valido. Si prega di riprovare in un altro momento.'),
        title: simpleRteConfig('Siamo spiacenti, la pagina richiesta non è stata trovata'),
      },
      error500: {
        description: simpleRteConfig('Potrebbe essere stata eliminata, rinominata o l’URL inserito non è valido. Si prega di riprovare in un altro momento.'),
        title: simpleRteConfig('Siamo spiacenti, la pagina richiesta non è stata trovata'),
      },
      homeButtonText: simpleRteConfig('Vai alla pagina iniziale'),
      meta: {
        seo: {
          description: 'Pagina non trovata',
          title: 'Messaggio di errore',
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
        copyButtonText: simpleRteConfig('Copia il testo'),
        title: simpleRteConfig('Citazione'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('Confermo di avere letto e accettato la informativa sulla protezione dei dati.'),
          errorMessage: simpleRteConfig('Si prega di accettare le linee guida sulla protezione dei dati.'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('download'),
        exportArticleButtonText: simpleRteConfig('Esporta gli articoli'),
        linksTitle: simpleRteConfig('link'),
        time: simpleRteConfig('Ora'),
        writeEmailButtonText: simpleRteConfig('Scrivi una e-mail'),
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
        buttonAcceptAll: simpleRteConfig('Accetta tutti'),
        buttonCustomizeSelection: simpleRteConfig('Modifica i criteri di selezione'),
        buttonDeclineAll: simpleRteConfig('Rifiuta tutti'),
        text: simpleRteConfig('Utilizziamo i cookie per offrire un’esperienza utente ottimale. Per maggiori informazioni si prega di leggere le nostre linee guida sulla protezione dei dati.'),
        title: simpleRteConfig('Questo sito web utilizza cookie'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('Utilizziamo questi cookie per tracciare il comportamento delle/degli utenti. L’analisi ci aiuta a tenere sempre aggiornato il sito web.'),
          title: simpleRteConfig('Analytics e Performance'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('da'),
          toggleLabelOn: simpleRteConfig('a'),
        },
        buttonAcceptAll: simpleRteConfig('Accetta tutti'),
        buttonAcceptSelection: simpleRteConfig('Modifica i criteri di selezione'),
        externalContent: {
          text: simpleRteConfig('I contenuti esterni comprendono i cookie impostati da fornitori terzi per consentire al nostro sito web di mettere a disposizione contenuti provenienti dalle loro piattaforme (ad es. video o feed dei social media).'),
          title: simpleRteConfig('Contenuti esterni'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('da'),
          toggleLabelOn: simpleRteConfig('a'),
        },
        necessaryCookies: {
          text: simpleRteConfig('Si tratta di cookie necessari alle funzioni di base del sito web. Non è quindi possibile disattivarli.'),
          title: simpleRteConfig('Cookie necessari'),
          toggleLabel: simpleRteConfig('Sempre a'),
        },
        text: simpleRteConfig('Avete il pieno controllo sulla vostra privacy perché siete voi a decidere se possiamo o meno utilizzare determinati cookie.'),
        title: simpleRteConfig('Impostazioni cookie'),
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
        message: simpleRteConfig('Stiamo già lavorando a una soluzione. Ci scusiamo per l’inconveniente e vi invitiamo a riprovare più tardi.'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('Il sistema al momento non è disponibile.'),
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
          fieldError: simpleRteConfig('Inserite il vostro nome e cognome.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Nome e cognome'),
          name: 'nome-e-cognome',
          placeholder: 'Il vostro nome e cognome',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('Inserite il vostro indirizzo e-mail.'),
          fieldWidth: 'half',
          label: simpleRteConfig('E-mail'),
          name: 'e-mail',
          placeholder: 'Il vostro indirizzo e-mail',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('Inserite un messaggio.'),
          fieldWidth: 'full',
          label: simpleRteConfig('Messaggio'),
          name: 'messaggio',
          placeholder: 'Il vostro messaggio',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'Nuovo messaggio tramite il sito web',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Inviare un messaggio',
      submitError: {
        text: simpleRteConfig('Si prega di ricaricare la pagina e di riprovare. In alternativa scriveteci a sagw@sagw.ch'),
        title: simpleRteConfig('Purtroppo l’operazione non è andata a buon fine!'),
      },
      submitSuccess: {
        text: simpleRteConfig('Abbiamo ricevuto il vostro messaggio e vi ricontatteremo al più presto.'),
        title: simpleRteConfig('Grazie!'),
      },
      subtitle: simpleRteConfig('Avete delle domande? Non esitate a contattarci.'),
      tenant: tenantId,
      title: simpleRteConfig('Contatto'),
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
        description: simpleRteConfig('It may have been removed or renamed, or the address may have been incorrect. Please try again later.'),
        title: simpleRteConfig('Sorry – page not found'),
      },
      error500: {
        description: simpleRteConfig('It may have been removed or renamed, or the address may have been incorrect. Please try again later.'),
        title: simpleRteConfig('Sorry – page not found'),
      },
      homeButtonText: simpleRteConfig('Home'),
      meta: {
        seo: {
          description: 'The page couldn\'t be found',
          title: 'Error',
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
        copyButtonText: simpleRteConfig('Copy text'),
        title: simpleRteConfig('Citation'),
      },
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: simpleRteConfig('I have read and accepted the information on data privacy.'),
          errorMessage: simpleRteConfig('Please accept the privacy notes.'),
        },
      },
      generic: {
        downloadTitle: simpleRteConfig('Downloads'),
        exportArticleButtonText: simpleRteConfig('Export articles'),
        linksTitle: simpleRteConfig('Links'),
        time: simpleRteConfig('Clock'),
        writeEmailButtonText: simpleRteConfig('Send an e-mail'),
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
        buttonAcceptAll: simpleRteConfig('Accept all'),
        buttonCustomizeSelection: simpleRteConfig('Manage preferences'),
        buttonDeclineAll: simpleRteConfig('Reject all'),
        text: simpleRteConfig('We use cookies to provide the best possible experience. Read our data protection guidelines for further information.'),
        title: simpleRteConfig('This website uses cookies'),
      },
      overlay: {
        analyticsPerformance: {
          text: simpleRteConfig('We use these cookies to track user behaviour. By analysing user behaviour, we can constantly improve our website.'),
          title: simpleRteConfig('Analytics and performance'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('Off'),
          toggleLabelOn: simpleRteConfig('On'),
        },
        buttonAcceptAll: simpleRteConfig('Accept all'),
        buttonAcceptSelection: simpleRteConfig('Manage preferences'),
        externalContent: {
          text: simpleRteConfig('External content consists of third-party cookies that enable us to provide content from third-party platforms on our website (e.g. videos or social media feeds).'),
          title: simpleRteConfig('External content'),
          toggleDefault: 'on',
          toggleLabelOff: simpleRteConfig('Off'),
          toggleLabelOn: simpleRteConfig('On'),
        },
        necessaryCookies: {
          text: simpleRteConfig('These cookies are necessary for the correct functioning of the website and cannot be deactivated.'),
          title: simpleRteConfig('Essential cookies'),
          toggleLabel: simpleRteConfig('Always on'),
        },
        text: simpleRteConfig('You have full control over your privacy and can decide which cookies we can – and cannot – use.'),
        title: simpleRteConfig('Cookie settings'),
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
        message: simpleRteConfig('We are working on a solution. We apologise for the inconvenience. Please try again later.'),
        optionalLink: {
          includeLink: false,
        },
        show: {
          display: 'hide',
        },
        showOnHomeOnly: false,
        title: simpleRteConfig('The system is currently unavailable.'),
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
          fieldError: simpleRteConfig('Enter your first and last name'),
          fieldWidth: 'half',
          label: simpleRteConfig('First and last name'),
          name: 'first-and-last-name',
          placeholder: 'Your first and last name',
          required: true,
        },
        {
          blockType: 'emailBlock',
          fieldError: simpleRteConfig('Enter your e-mail address.'),
          fieldWidth: 'half',
          label: simpleRteConfig('E-mail'),
          name: 'e-mail',
          placeholder: 'Your e-mail address.',
          required: true,
        },
        {
          blockType: 'textareaBlock',
          fieldError: simpleRteConfig('Enter your message'),
          fieldWidth: 'full',
          label: simpleRteConfig('Message'),
          name: 'message',
          placeholder: 'Your message.',
          required: true,
        },
      ],
      isNewsletterForm: 'custom',
      mailSubject: 'New message via website',
      recipientMail: 'change-this@before-publishing.com',
      senderMail: 'sagw@sagw.ch',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Send message',
      submitError: {
        text: simpleRteConfig('Please reload the page and try again. Or write to us at sagw@sagw.ch'),
        title: simpleRteConfig('Sorry, something went wrong.'),
      },
      submitSuccess: {
        text: simpleRteConfig('We have received your message and will be in touch promptly.'),
        title: simpleRteConfig('Thank you.'),
      },
      subtitle: simpleRteConfig('Have a question? Then get in touch.'),
      tenant: tenantId,
      title: simpleRteConfig('Contact'),
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
