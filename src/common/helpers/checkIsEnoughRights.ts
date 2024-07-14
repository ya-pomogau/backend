import { AdminInterface, AdminPermission, UserRole } from '../types/user.types';

export const checkIsEnoughRights = (
  user: AdminInterface,
  requirements: AdminPermission[],
  onlyRoot = false
): boolean => {
  if (user.role !== UserRole.ADMIN || (onlyRoot && !user.isRoot)) {
    return false;
  }

  if (user.isRoot) {
    return true;
  }

  let hasPermission = false;
  if (onlyRoot === false && requirements.length > 0) {
    hasPermission = requirements.every((requirement) =>
      user.permissions.some((permission) => permission === requirement)
    );
  }
  return hasPermission;
};
