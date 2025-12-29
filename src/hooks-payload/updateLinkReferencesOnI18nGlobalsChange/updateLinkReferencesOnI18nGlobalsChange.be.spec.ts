import {
  expect,
  test,
} from '@playwright/test';
import { generateDetailPage } from '@/test-helpers/page-generator';
// import { generateTenant } from '@/test-helpers/tenant-generator';
import { sampleRteWithLink } from '@/utilities/rteSampleContent';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { getTenant } from '@/test-helpers/tenant-generator';

const getCollectionsDocumentForId = async (id: string): Promise<any> => {
  const payload = await getPayloadCached();

  const linksCollectionDocument = await payload.find({
    collection: 'links',
    limit: 1,
    where: {
      and: [
        {
          documentId: {
            equals: id,
          },
        },
      ],
    },
  });

  return linksCollectionDocument.docs[0];
};

test('Adds/removes reference to link document (for data privacy checkbox)', {
  tag: '@linking',
}, async () => {
  const payload = await getPayloadCached();
  const tenant = await getTenant();
  const time = (new Date())
    .getTime();

  const home = await payload.find({
    collection: 'homePage',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  const i18nGlobals = await payload.find({
    collection: 'i18nGlobals',
    where: {
      tenant: {
        equals: tenant,
      },
    },
  });

  // empty homepage
  await payload.update({
    collection: 'homePage',
    data: {
      content: [],
    },
    id: home.docs[0].id,
  });

  const homeId = home.docs[0].id;

  // Generate pages to link to
  const detail1 = await generateDetailPage({
    navigationTitle: 'd1',
    title: `d1 ${time}`,
  });

  const detail2 = await generateDetailPage({
    navigationTitle: 'd2',
    title: `d2 ${time}`,
  });

  // add form
  const newsletterForm = await payload.create({
    collection: 'forms',
    data: {
      colorMode: 'dark',
      isNewsletterForm: 'newsletter',
      newsletterFields: {
        actionText: 'Erneut senden',
        email: {
          fieldError: simpleRteConfig('Bitte geben Sie die E-Mail Adresse an.'),
          fieldWidth: 'full',
          label: simpleRteConfig('E-Mail'),
          placeholder: 'Ihre E-Mail Adresse',
        },
        firstName: {
          fieldError: simpleRteConfig('Bitte geben Sie Ihren Vornamen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Vorname'),
          placeholder: 'Ihr Vorname',
        },
        includeLanguageSelection: 'yes',
        lastName: {
          fieldError: simpleRteConfig('Bitte geben Sie Ihren Nachnamen an.'),
          fieldWidth: 'half',
          label: simpleRteConfig('Nachname'),
          placeholder: 'Ihr Nachname',
        },
      },
      recipientMail: 'delivered@resend.dev',
      showPrivacyCheckbox: true,
      submitButtonLabel: 'Abschicken',
      submitError: {
        text: simpleRteConfig('Newsletter Submit text error'),
        title: simpleRteConfig('Newsletter Submit title error'),
      },
      submitSuccess: {
        text: simpleRteConfig('Newsletter Submit text success'),
        title: simpleRteConfig('Newsletter Submit title success'),
      },
      subtitle: simpleRteConfig('Subtitle for Newsletter Form'),
      tenant,
      title: simpleRteConfig('Newsletter Form'),
    },
  });

  // add link to data privacy checkbox
  await payload.update({
    collection: 'i18nGlobals',
    data: {
      ...i18nGlobals.docs[0],
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: sampleRteWithLink({
            documentId: detail1.id,
            slug: 'detailPage',
            text: '[test]data-privacy-checkbox:link',
          }),
          errorMessage: simpleRteConfig('Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen'),
        },
      },
    },
    id: i18nGlobals.docs[0].id,
  });

  await payload.update({
    collection: 'homePage',
    data: {
      content: [
        {
          blockType: 'formBlock',
          form: newsletterForm,
        },
      ],
    },
    id: homeId,
  });

  const d1Link = await getCollectionsDocumentForId(detail1.id);

  await expect(d1Link.references[0].pageId)
    .toStrictEqual(homeId);

  console.log('done 1');

  // remove link from data privacy checkbox
  await payload.update({
    collection: 'i18nGlobals',
    data: {
      ...i18nGlobals.docs[0],
      forms: {
        dataPrivacyCheckbox: {
          dataPrivacyCheckboxText: sampleRteWithLink({
            documentId: detail2.id,
            slug: 'detailPage',
            text: '[test]data-privacy-checkbox:link',
          }),
          errorMessage: simpleRteConfig('Bitte akzeptieren sie die allgemeinen Geschäftsbedingungen'),
        },
      },
    },
    id: i18nGlobals.docs[0].id,
  });

  const d1LinkUpdated = await getCollectionsDocumentForId(detail1.id);

  console.log(d1LinkUpdated);

  await expect(d1LinkUpdated.references)
    .toHaveLength(0);

  console.log('done 2');

});
