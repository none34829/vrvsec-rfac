import { useCallback } from 'react';
import { RBACManager, PermissionCheck } from '@/lib/rbac';
import { useData } from '@/contexts/DataContext';

export function useRBAC() {
  const { currentUser } = useData();
  const rbacManager = RBACManager.getInstance();

  const checkPermission = useCallback(
    (check: PermissionCheck) => {
      if (!currentUser) return false;
      return rbacManager.hasPermission(currentUser, check);
    },
    [currentUser, rbacManager]
  );

  const checkRole = useCallback(
    (roles: string[], requireAll = false) => {
      if (!currentUser) return false;
      return requireAll
        ? rbacManager.hasAllRoles(currentUser, roles)
        : rbacManager.hasAnyRole(currentUser, roles);
    },
    [currentUser, rbacManager]
  );

  const getEffectivePermissions = useCallback(() => {
    if (!currentUser) return [];
    return rbacManager.getUserPermissions(currentUser);
  }, [currentUser, rbacManager]);

  const getPermissionHierarchy = useCallback(() => {
    if (!currentUser) return {};
    return rbacManager.getPermissionHierarchy(currentUser.roles);
  }, [currentUser, rbacManager]);

  return {
    checkPermission,
    checkRole,
    getEffectivePermissions,
    getPermissionHierarchy,
    isAuthenticated: !!currentUser,
    currentUser,
  };
}
