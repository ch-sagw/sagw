import {
  expect,
  test,
} from '@playwright/test';
import { explicitRoleLogin } from '@/test-helpers/payload-login';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';

test('correctly generates fullname', async () => {
  const {
    tenant,
    payload,
    user,
  } = await explicitRoleLogin('sagw-admin');

  const createdPerson = await payload.create({
    collection: 'people',
    data: {
      firstname: simpleRteConfig('name'),
      function: simpleRteConfig('function'),
      lastname: simpleRteConfig('lastname'),
      mail: 'foo@bar.com',
      phone: '031 123 45 67',
      tenant,
    },
    overrideAccess: true,
    req: {
      data: {
        tenant,
      },
      user,
    },
  });

  await expect(createdPerson.fullName)
    .toStrictEqual('name lastname');

});
