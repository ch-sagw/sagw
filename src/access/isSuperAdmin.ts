import type { Access } from 'payload';
import { User } from '../payload-types';
import { userRoles } from '@/collections/Plc/Users/roles';

// TODO: delete after access model is migrated
export const isSuperAdmin = (user: User | null): boolean => Boolean(user?.roles?.includes(userRoles.admin));

// TODO: delete after access model is migrated
export const isSuperAdminAccess: Access = ({
  req,
}): boolean => isSuperAdmin(req.user);

