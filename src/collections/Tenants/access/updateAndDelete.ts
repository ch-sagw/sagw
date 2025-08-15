import { Access } from 'payload';
import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { departmentRoles } from '@/collections/Users/roles';

export const updateAndDeleteAccess: Access = ({
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
      in: getUserTenantIDs(req.user, departmentRoles.admin),
    },
  };
};
