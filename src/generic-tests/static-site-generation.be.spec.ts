import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDataPrivacyPage,
  generateDetailPage,
  generateEventDetailPage,
  generateHomePage,
  generateImpressumPage,
  generateNewsDetailPage,
  generateOverviewPage,
} from '@/test-helpers/collections-generator';
import {
  generateTenant, getTenantId,
} from '@/test-helpers/tenant-generator';
import {
  deleteOtherCollections, deleteSetsPages,
  deleteSingletonPages,
  deleteTenants,
} from '@/seed/test-data/deleteData';
import { generateStaticParams } from '@/app/(frontend)/utilities/generateStaticParams';

const generatePages = async ({
  amountPerPage,
  tenant,
}: {
  amountPerPage: number;
  tenant: string;
}): Promise<string> => {
  const indices = Array.from({
    length: amountPerPage,
  }, (_, idx) => idx + 1);

  const home = await generateHomePage({
    locale: 'de',
    sideTitle: 'Side',
    tenant,
    title: 'Home',
  });

  /* eslint-disable no-await-in-loop */

  for (const i of indices) {
    await generateDetailPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `detail ${i}`,
    });

    await generateOverviewPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `overview ${i}`,
    });

    await generateEventDetailPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `event ${i}`,
    });

    await generateNewsDetailPage({
      parentPage: {
        documentId: home.id,
        slug: 'homePage',
      },
      tenant,
      title: `news ${i}`,
    });
  }

  await generateImpressumPage({
    tenant,
  });

  await generateDataPrivacyPage({
    tenant,
  });

  return home.id;

  /* eslint-enable no-await-in-loop */
};

test('generates all static pages on build', async () => {
  await deleteSetsPages();
  await deleteOtherCollections();
  await deleteSingletonPages();
  await deleteTenants();

  const time = (new Date())
    .getTime();

  const tenant = await getTenantId({
    isSagw: true,
    time,
  });

  const tenantNonSagw = await generateTenant({
    addDefaultTenantData: false,
    name: `tenant-${time}`,
  });

  // generate sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant,
  });

  // generate non-sagw pages
  await generatePages({
    amountPerPage: 2,
    tenant: tenantNonSagw.id,
  });

  // we expect:
  // ----------
  // detail page 1: 8
  // detail page 2: 8
  // overview page 1: 8
  // overview page 2: 8
  // event 1: 8
  // event 2: 8
  // news 1: 8
  // news 2: 8
  // impressum: 8
  // data-privacy: 8
  // home: 8
  // -----------
  // = 80

  const staticParams = await generateStaticParams({
    ignoreEnvGuard: true,
    mode: 'route',
  });

  const langs = [
    'de',
    'fr',
    'it',
    'en',
  ];

  const tenants = [
    '',
    tenantNonSagw.slug,
  ];

  const staticParamsString = JSON.stringify(staticParams);

  console.log(staticParamsString);

  /* eslint-disable no-await-in-loop */
  for (const currentTenant of tenants) {
    for (const lang of langs) {
      const expectedTenantSlug = [];

      if (currentTenant !== '') {
        let tenantString = currentTenant;

        if (lang !== 'de') {
          tenantString += `-${lang}`;
        }

        expectedTenantSlug.push(tenantString);
      }

      const detail1 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['detail-1']),
      });

      const detail2 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['detail-2']),
      });

      const overview1 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['overview-1']),
      });

      const overview2 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['overview-2']),
      });

      const event1 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['event-1']),
      });

      const event2 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['event-2']),
      });

      const news1 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['news-1']),
      });

      const news2 = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat(['news-2']),
      });

      // impressum, data-privacy, home
      const home = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug,
      });

      const impressum = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat([`impressum-${lang}`]),
      });

      const dataPrivacy = JSON.stringify({
        locale: lang,
        slug: expectedTenantSlug.concat([`data-privacy-${lang}`]),
      });

      await expect(staticParamsString.indexOf(detail1)).not.toBe(-1);
      await expect(staticParamsString.indexOf(detail2)).not.toBe(-1);
      await expect(staticParamsString.indexOf(overview1)).not.toBe(-1);
      await expect(staticParamsString.indexOf(overview2)).not.toBe(-1);
      await expect(staticParamsString.indexOf(event1)).not.toBe(-1);
      await expect(staticParamsString.indexOf(event2)).not.toBe(-1);
      await expect(staticParamsString.indexOf(news1)).not.toBe(-1);
      await expect(staticParamsString.indexOf(news2)).not.toBe(-1);
      await expect(staticParamsString.indexOf(home)).not.toBe(-1);
      await expect(staticParamsString.indexOf(impressum)).not.toBe(-1);
      await expect(staticParamsString.indexOf(dataPrivacy)).not.toBe(-1);
    }
  }
  /* eslint-enable no-await-in-loop */

  await expect(staticParams)
    .toHaveLength(88);
});

