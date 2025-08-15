import { User } from '@/payload-types';

export const isAccessingSelf = ({
  id, user,
}: { user?: User; id?: string | number }): boolean => (user
  ? Boolean(user.id === id)
  : false);
