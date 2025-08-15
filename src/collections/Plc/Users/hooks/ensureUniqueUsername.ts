import {
  FieldHook, ValidationError, Where,
} from 'payload';
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities';

import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import { getCollectionIDType } from '@/utilities/getCollectionIdType';
import { userRoles } from '@/collections/Plc/Users/roles';

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

  const selectedDepartment = getTenantFromCookie(
    req.headers,
    getCollectionIDType({
      collectionSlug: 'departments',
      payload: req.payload,
    }),
  );

  if (selectedDepartment) {
    constraints.push({
      'departments.department': {
        equals: selectedDepartment,
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
    const departmentIDs = getUserDepartmentIDs(req.user);

    // if the user is an admin or has access to more than 1 department
    // provide a more specific error message
    if (req.user.roles?.includes(userRoles.admin) || departmentIDs.length > 1) {
      if (typeof selectedDepartment === 'string' || typeof selectedDepartment === 'number') {
        const attemptedDepartmentChange = await req.payload.findByID({
          collection: 'departments',
          id: selectedDepartment,
        });

        throw new ValidationError({
          errors: [
            {
              message: `The "${attemptedDepartmentChange.name}" department already has a user with the username "${value}". Usernames must be unique per department.`,
              path: 'username',
            },
          ],
        });
      }
    }

    throw new ValidationError({
      errors: [
        {
          message: `A user with the username ${value} already exists. Usernames must be unique per department.`,
          path: 'username',
        },
      ],
    });
  }

  return value;
};
