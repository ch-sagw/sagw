import type { Access } from 'payload';

import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { departmentRoles } from '@/collections/Users/roles';

export const filterByTenantRead: Access = (args) => {

  // Allow public tenants to be read by anyone
  if (!args.req.user) {
    return {
      allowPublicRead: {
        equals: true,
      },
    };
  }

  return true;
};

export const canMutateTenant: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isGlobalAdmin(req.user)) {
    return true;
  }

  return {
    id: {
      in:
        req.user?.tenants
          ?.map(({
            roles, tenant,
          }) => (roles?.includes(departmentRoles.admin)
            ? tenant && (typeof tenant === 'string'
              ? tenant
              : tenant.id)
            : null))
          .filter(Boolean) || [],
    },
  };
};
