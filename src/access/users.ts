import type { PayloadRequest } from 'payload';
import { User } from '@/payload-types';
import { isSuperAdmin } from '@/collections/Plc/Users/roles';

interface InterfaceAccessArgs {
  req: PayloadRequest;
  id?: string | number;
}

export const isAccessingSelf = ({
  id, user,
}: { user?: User; id?: string | number }): boolean => (user
  ? Boolean(user.id === id)
  : false);

const createAccess = ({
  req,
}: InterfaceAccessArgs): boolean => isSuperAdmin(req);

const updateAccess = ({
  req,
  id,
}: InterfaceAccessArgs): boolean => {
  if (!req.user) {
    return false;
  }

  if (isSuperAdmin(req)) {
    return true;
  }

  const accessingSelf = isAccessingSelf({
    id,
    user: req.user,
  });

  if (accessingSelf) {
    return true;
  }

  return false;
};

const updateAccessWithoutSelf = ({
  req,
}: InterfaceAccessArgs): boolean => isSuperAdmin(req);

const deleteAccess = ({
  req,
}: InterfaceAccessArgs): boolean => isSuperAdmin(req);

const readAccess = ({
  req,
  id,
}: InterfaceAccessArgs): boolean => {
  if (!req.user) {
    return false;
  }

  if (isAccessingSelf({
    id,
    user: req.user,
  })) {
    return true;
  }

  return isSuperAdmin(req);
};

// General User Access

export const usersAccess = {
  create: createAccess,
  delete: deleteAccess,
  read: readAccess,
  update: updateAccess,
};

// Field Access - same functions, compatible types
export const usersFieldAccess = usersAccess;

// Field Access for roles and tenant assignments: users can read their own
// values, only super-admins can change them.
// The admin panel hands the user to the multi-tenant plugin with field read
// access applied. If users can not read their own tenants, the plugin finds
// no tenant for them and redirects the singleton pages to the dashboard.
export const usersFieldAccessReadSelf = {
  create: createAccess,
  read: readAccess,
  update: updateAccessWithoutSelf,
};
