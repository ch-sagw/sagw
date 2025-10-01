import { isSuperAdmin } from '@/access/isSuperAdmin';
import { getUserTenantIDs } from '@/utilities/getUserTenantIds';
import { Access } from 'payload';
import { tenantRoles } from '@/collections/Plc/Users/roles';

export const updateAndDeleteAccess: Access = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req.user)) {
    return true;
  }

  return {
    id: {
      in: getUserTenantIDs(req.user, tenantRoles.admin),
    },
  };
};
