
import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { extendExpect } from '@/access/test/extendExpect';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import {
  getTenant, getTenantNonSagw,
} from '@/test-helpers/tenant-generator';
import { generateCollectionsExceptPages } from '@/test-helpers/collections-generator';

/* eslint-disable max-nested-callbacks */

extendExpect(expect);

test.describe('access-global', () => {
  test.beforeEach(async () => {

    // delete data
    await deleteSetsPages();
    await deleteOtherCollections();

    // add generic data
    const tenant = await getTenant();
    const tenantNonSagw = await getTenantNonSagw();

    await generateCollectionsExceptPages({
      tenant: tenant || '',
    });

    await generateCollectionsExceptPages({
      tenant: tenantNonSagw || '',
    });
  });

  test.describe('can not add network categories', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change network categories', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category illegaly changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete network categories', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'networkCategories',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not add projects', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change projects', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete projects', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'projects',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not add publication topics', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change publication topics', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete publication topics', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTopics',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not add publication types', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change publication types', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete publication types', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTypes',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not add event categories', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change event categories', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete event categories', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'eventCategory',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not add people', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change people', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete people', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'people',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not add teams', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'teams',
          data: {
            name: simpleRteConfig('team'),
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change teams', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'teams',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not delete teams', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'teams',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not create forms', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        await payload.create({
          collection: 'forms',
          data: {
            colorMode: 'dark',
            fields: [
              {
                blockType: 'textBlockForm',
                fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
                fieldWidth: 'half',
                label: simpleRteConfig('Name'),
                name: 'name',
                placeholder: 'Ihr Name',
                required: true,
              },
            ],
            isNewsletterForm: 'custom',
            mailSubject: 'Form submission on SAGW',
            recipientMail: 'delivered@resend.dev',
            showPrivacyCheckbox: false,
            submitButtonLabel: 'Abschicken',
            submitError: {
              text: simpleRteConfig('Submit text error'),
              title: simpleRteConfig('Submit title error'),
            },
            submitSuccess: {
              text: simpleRteConfig('Submit text success'),
              title: simpleRteConfig('Submit title success'),
            },
            subtitle: simpleRteConfig('Subtitle for contact Form'),
            tenant,
            title: simpleRteConfig('Contact Form'),
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'forms',
          data: {
            colorMode: 'dark',
            fields: [
              {
                blockType: 'textBlockForm',
                fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
                fieldWidth: 'half',
                label: simpleRteConfig('Name'),
                name: 'name',
                placeholder: 'Ihr Name',
                required: true,
              },
            ],
            isNewsletterForm: 'custom',
            mailSubject: 'Form submission on SAGW',
            recipientMail: 'delivered@resend.dev',
            showPrivacyCheckbox: false,
            submitButtonLabel: 'Abschicken',
            submitError: {
              text: simpleRteConfig('Submit text error'),
              title: simpleRteConfig('Submit title error'),
            },
            submitSuccess: {
              text: simpleRteConfig('Submit text success'),
              title: simpleRteConfig('Submit title success'),
            },
            subtitle: simpleRteConfig('Subtitle for contact Form'),
            tenant,
            title: simpleRteConfig('Contact Form'),
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 400,
      });

    });
  });

  test.describe('can not change forms', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'forms',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'forms',
          data: {
            mailSubject: 'Form submission on SAGW changed',
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

  });

  test.describe('can not delete forms', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const foundItems = await payload.find({
          collection: 'forms',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'forms',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

  });

  test.describe('can not change consent', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const consentPage = await payload.find({
          collection: 'consent',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'consent',
          data: {
            banner: {
              title: simpleRteConfig('changed banner title'),
            },
          },
          id: consentPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const consentPage = await payload.find({
          collection: 'consent',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'consent',
          data: {
            banner: {
              title: simpleRteConfig('changed banner title'),
            },
          },
          id: consentPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change header', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const navigationPage = await payload.find({
          collection: 'header',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        const changedItems: any = navigationPage.docs[0].navigation;

        changedItems.navItems[0].description = simpleRteConfig('description changed');

        await payload.update({
          collection: 'header',
          data: {
            navigation: changedItems,
          },
          id: navigationPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const navigationPage = await payload.find({
          collection: 'header',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        const changedItems: any = navigationPage.docs[0].navigation;

        changedItems.navItems[0].description = simpleRteConfig('description changed');

        await payload.update({
          collection: 'header',
          data: {
            navigation: changedItems,
          },
          id: navigationPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

  });

  test.describe('can not change footer', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const footerPage = await payload.find({
          collection: 'footer',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'footer',
          data: {
            legal: {
              dataPrivacy: simpleRteConfig('changed'),
            },
          },
          id: footerPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const footerPage = await payload.find({
          collection: 'footer',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'footer',
          data: {
            legal: {
              dataPrivacy: simpleRteConfig('changed'),
            },
          },
          id: footerPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });
  });

  test.describe('can not change statue message', () => {
    test('translator', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('translator');

        const statusMessagePage = await payload.find({
          collection: 'statusMessage',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'statusMessage',
          data: {
            content: {
              title: simpleRteConfig('changed'),
            },
          },
          id: statusMessagePage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      }).rejects.toMatchObject({
        status: 403,
      });

    });

  });

  test.describe('can add network categories', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change network categories', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category illegaly changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category illegaly changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'networkCategories',
          data: {
            name: simpleRteConfig('Network Category illegaly changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can delete network categories', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'networkCategories',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'networkCategories',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'networkCategories',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'networkCategories',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can add projects', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change projects', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'projects',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can delete projects', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'projects',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'projects',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'projects',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can add publication topics', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change publication topics', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTopics',
          data: {
            publicationTopic: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can delete publication topics', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTopics',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTopics',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'publicationTopics',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTopics',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can add publication types', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change publication types', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'publicationTypes',
          data: {
            publicationType: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });
  });

  test.describe('can delete publication types', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTypes',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTypes',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'publicationTypes',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'publicationTypes',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can add event categories', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name'),
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change event categories', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'eventCategory',
          data: {
            eventCategory: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });
  });

  test.describe('can delete event categories', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'eventCategory',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'eventCategory',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'eventCategory',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'eventCategory',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can add people', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change people', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can delete people', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'people',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'people',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'people',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'people',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can add teams', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const person = await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });

        await payload.create({
          collection: 'teams',
          data: {
            name: simpleRteConfig('team'),
            people: [person],
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const person = await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });

        await payload.create({
          collection: 'teams',
          data: {
            name: simpleRteConfig('team'),
            people: [person],
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const person = await payload.create({
          collection: 'people',
          data: {
            firstname: simpleRteConfig('name'),
            function: simpleRteConfig('function'),
            lastname: simpleRteConfig('lastname'),
            mail: 'foo@bar.com',
            phone: '031 123 45 67',
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });

        await payload.create({
          collection: 'teams',
          data: {
            name: simpleRteConfig('team'),
            people: [person],
            tenant,
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change teams', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'teams',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'teams',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'teams',
          data: {
            name: simpleRteConfig('name changed'),
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can delete teams', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'teams',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'teams',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'teams',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'teams',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can create forms', () => {
    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        await payload.create({
          collection: 'forms',
          data: {
            colorMode: 'dark',
            fields: [
              {
                blockType: 'textBlockForm',
                fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
                fieldWidth: 'half',
                label: simpleRteConfig('Name'),
                name: 'name',
                placeholder: 'Ihr Name',
                required: true,
              },
            ],
            isNewsletterForm: 'custom',
            mailSubject: 'Form submission on SAGW',
            recipientMail: 'foo@bar.com',
            showPrivacyCheckbox: false,
            submitButtonLabel: 'Abschicken',
            submitError: {
              text: simpleRteConfig('Submit text error'),
              title: simpleRteConfig('Submit title error'),
            },
            submitSuccess: {
              text: simpleRteConfig('Submit text success'),
              title: simpleRteConfig('Submit title success'),
            },
            subtitle: simpleRteConfig('Subtitle for contact Form'),
            tenant,
            title: simpleRteConfig('Contact Form'),
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        await payload.create({
          collection: 'forms',
          data: {
            colorMode: 'dark',
            fields: [
              {
                blockType: 'textBlockForm',
                fieldError: simpleRteConfig('Geben Sie Ihren Namen an.'),
                fieldWidth: 'half',
                label: simpleRteConfig('Name'),
                name: 'name',
                placeholder: 'Ihr Name',
                required: true,
              },
            ],
            isNewsletterForm: 'custom',
            mailSubject: 'Form submission on SAGW',
            recipientMail: 'foo@bar.com',
            showPrivacyCheckbox: false,
            submitButtonLabel: 'Abschicken',
            submitError: {
              text: simpleRteConfig('Submit text error'),
              title: simpleRteConfig('Submit title error'),
            },
            submitSuccess: {
              text: simpleRteConfig('Submit text success'),
              title: simpleRteConfig('Submit title success'),
            },
            subtitle: simpleRteConfig('Subtitle for contact Form'),
            tenant,
            title: simpleRteConfig('Contact Form'),
          },
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change forms', () => {
    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'forms',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'forms',
          data: {
            mailSubject: 'Form submission on SAGW changed',
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'forms',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'forms',
          data: {
            mailSubject: 'Form submission on SAGW changed',
          },
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

  });

  test.describe('can delete forms', () => {
    test('sagw-admin', async () => {
      await expect(async () => {
        const tenant = await getTenant();
        const {
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const foundItems = await payload.find({
          collection: 'forms',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'forms',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const tenant = await getTenantNonSagw();
        const {
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const foundItems = await payload.find({
          collection: 'forms',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.delete({
          collection: 'forms',
          id: foundItems.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

  });

  test.describe('can change consent', () => {
    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const consentPage = await payload.find({
          collection: 'consent',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'consent',
          data: {
            banner: {
              title: simpleRteConfig('changed banner title'),
            },
          },
          id: consentPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const consentPage = await payload.find({
          collection: 'consent',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'consent',
          data: {
            banner: {
              title: simpleRteConfig('changed banner title'),
            },
          },
          id: consentPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change header', () => {
    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const navigationPage = await payload.find({
          collection: 'header',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        const changedItems: any = navigationPage.docs[0].navigation;

        changedItems.navItems[0].description = simpleRteConfig('description changed');

        await payload.update({
          collection: 'header',
          data: {
            navigation: changedItems,
          },
          id: navigationPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const navigationPage = await payload.find({
          collection: 'header',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        const changedItems: any = navigationPage.docs[0].navigation;

        changedItems.navItems[0].description = simpleRteConfig('description changed');

        await payload.update({
          collection: 'header',
          data: {
            navigation: changedItems,
          },
          id: navigationPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();
    });

  });

  test.describe('can change footer', () => {
    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const footerPage = await payload.find({
          collection: 'footer',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'footer',
          data: {
            legal: {
              dataPrivacy: simpleRteConfig('changed'),
            },
          },
          id: footerPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const footerPage = await payload.find({
          collection: 'footer',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'footer',
          data: {
            legal: {
              dataPrivacy: simpleRteConfig('changed'),
            },
          },
          id: footerPage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });
  });

  test.describe('can change statue message', () => {
    test('editor', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('editor');

        const statusMessagePage = await payload.find({
          collection: 'statusMessage',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'statusMessage',
          data: {
            content: {
              title: simpleRteConfig('changed'),
            },
          },
          id: statusMessagePage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('sagw-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('sagw-admin');

        const statusMessagePage = await payload.find({
          collection: 'statusMessage',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'statusMessage',
          data: {
            content: {
              title: simpleRteConfig('changed'),
            },
          },
          id: statusMessagePage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

    test('fg-admin', async () => {
      await expect(async () => {
        const {
          tenant,
          payload,
          user,
        } = await explicitRoleLogin('fg-admin');

        const statusMessagePage = await payload.find({
          collection: 'statusMessage',
          where: {
            tenant: {
              equals: tenant,
            },
          },
        });

        await payload.update({
          collection: 'statusMessage',
          data: {
            content: {
              title: simpleRteConfig('changed'),
            },
          },
          id: statusMessagePage.docs[0].id,
          overrideAccess: false,
          req: {
            data: {
              tenant,
            },
            user,
          },
        });
      })
        .notRejects();

    });

  });
});
