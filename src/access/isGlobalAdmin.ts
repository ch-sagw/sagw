import type { Access } from 'payload';
import { User } from '../payload-types';
import { userRoles } from '@/collections/Users/roles';

export const isGlobalAdmin = (user: User | null): boolean => Boolean(user?.roles?.includes(userRoles.admin));

export const isGlobalAdminAccess: Access = ({
  req,
}): boolean => isGlobalAdmin(req.user);
