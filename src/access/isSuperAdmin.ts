import type { Access } from 'payload';
import { User } from '../payload-types';
import { userRoles } from '@/collections/Plc/Users/roles';

export const isSuperAdmin = (user: User | null): boolean => Boolean(user?.roles?.includes(userRoles.admin));

export const isSuperAdminAccess: Access = ({
  req,
}): boolean => isSuperAdmin(req.user);

