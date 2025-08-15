import type { Access } from 'payload';

import type {
  Department, User,
} from '@/payload-types';

import { isGlobalAdmin } from '@/access/isGlobalAdmin';
import { getUserDepartmentIDs } from '@/utilities/getUserDepartmentIds';
import {
  departmentRoles, userRoles,
} from '@/collections/Users/roles';

export const createAccess: Access<User> = ({
  req,
}) => {
  if (!req.user) {
    return false;
  }

  if (isGlobalAdmin(req.user)) {
    return true;
  }

  if (!isGlobalAdmin(req.user) && req.data?.roles?.includes(userRoles.admin)) {
    return false;
  }

  const adminDepartmentAccessIDs = getUserDepartmentIDs(req.user, departmentRoles.admin);

  const requestedDepartments: Department['id'][] =
    req.data?.departments?.map((t: { department: Department['id'] }) => t.department) ?? [];

  const hasAccessToAllRequestedDepartments = requestedDepartments.every((departmentId) => adminDepartmentAccessIDs.includes(departmentId));

  if (hasAccessToAllRequestedDepartments) {
    return true;
  }

  return false;
};
