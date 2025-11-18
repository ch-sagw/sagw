import type { AccessArgs } from 'payload';
import { User } from '@/payload-types';
import { isSuperAdmin } from '@/collections/Plc/Users/roles';

export const isAccessingSelf = ({
  id, user,
}: { user?: User; id?: string | number }): boolean => (user
  ? Boolean(user.id === id)
  : false);

const createAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req);

const updateAccess = ({
  req,
  id,
}: AccessArgs): boolean => {
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
}: AccessArgs): boolean => isSuperAdmin(req);

const deleteAccess = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req);

const readAccess = ({
  req,
  id,
}: AccessArgs): boolean => {
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

const readAccessWithoutSelf = ({
  req,
}: AccessArgs): boolean => isSuperAdmin(req);

// General User Access

export const usersAccess = {
  create: createAccess,
  delete: deleteAccess,
  read: readAccess,
  update: updateAccess,
};

export const usersAccessWithoutSelf = {
  create: createAccess,
  delete: deleteAccess,
  read: readAccessWithoutSelf,
  update: updateAccessWithoutSelf,
};
