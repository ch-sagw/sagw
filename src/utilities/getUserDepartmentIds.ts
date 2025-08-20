import type {
  Department, User,
} from '@/payload-types';
import { extractID } from '@/utilities/extractId';

/**
 * Returns array of all department IDs assigned to a user
 *
 * @param user - User object with departments field
 * @param role - Optional role to filter by
 */
export const getUserDepartmentIDs = (
  user: null | User,
  role?: NonNullable<User['departments']>[number]['roles'][number],
): Department['id'][] => {
  if (!user) {
    return [];
  }

  return (
    user?.departments?.reduce<Department['id'][]>((acc, {
      roles, department,
    }) => {
      if (role && !roles.includes(role)) {
        return acc;
      }

      if (department) {
        acc.push(extractID(department));
      }

      return acc;
    }, []) || []
  );
};
