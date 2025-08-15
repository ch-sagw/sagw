import {
  FieldHook, ValidationError, Where,
} from 'payload';

import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
// import { extractID } from '@/utilities/extractId';
import { getCollectionIDType } from '@/utilities/getCollectionIdType';

export const ensureUniqueUsername: FieldHook = async ({
  originalDoc, req, value,
}) => {
  // if value is unchanged, skip validation
  if (originalDoc.username === value) {
    return value;
  }

  const constraints: Where[] = [
    {
      username: {
        equals: value,
      },
    },
  ];

  const selectedTenant = getTenantFromCookie(
    req.headers,
    getCollectionIDType({
      collectionSlug: 'tenants',
      payload: req.payload,
    }),
  );

  if (selectedTenant) {
    constraints.push({
      'tenants.tenant': {
        equals: selectedTenant,
      },
    });
  }

  const findDuplicateUsers = await req.payload.find({
    collection: 'users',
    where: {
      and: constraints,
    },
  });

  if (findDuplicateUsers.docs.length > 0 && req.user) {
    const tenantIDs = getUserTenantIDs(req.user);

    // if the user is an admin or has access to more than 1 tenant
    // provide a more specific error message
    if (req.user.roles?.includes('super-admin') || tenantIDs.length > 1) {
      if (typeof selectedTenant === 'string' || typeof selectedTenant === 'number') {
        const attemptedTenantChange = await req.payload.findByID({
          collection: 'tenants',
          id: selectedTenant,
        });

        throw new ValidationError({
          errors: [
            {
              message: `The "${attemptedTenantChange.name}" tenant already has a user with the username "${value}". Usernames must be unique per tenant.`,
              path: 'username',
            },
          ],
        });
      }
    }

    throw new ValidationError({
      errors: [
        {
          message: `A user with the username ${value} already exists. Usernames must be unique per tenant.`,
          path: 'username',
        },
      ],
    });
  }

  return value;
};
