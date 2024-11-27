import { useState, useCallback, useMemo } from 'react';
import { Permission, Role, User } from '@/types';
import { useData } from '@/contexts/DataContext';
import { RBACManager } from '@/lib/rbac';

export function usePermissions() {
  const { permissions: allPermissions, roles: allRoles, users: allUsers } = useData();
  const rbacManager = RBACManager.getInstance();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const moduleStats = useMemo(() => {
    const stats: Record<string, { total: number; used: number }> = {};
    
    allPermissions.forEach((permission) => {
      if (!stats[permission.module]) {
        stats[permission.module] = { total: 0, used: 0 };
      }
      stats[permission.module].total++;
      
      // Check if permission is used in any role
      if (allRoles.some((role) => role.permissions.some((p) => p.id === permission.id))) {
        stats[permission.module].used++;
      }
    });
    
    return stats;
  }, [allPermissions, allRoles]);

  const permissionsByModule = useMemo(() => {
    return allPermissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, [allPermissions]);

  const getRolePermissionCoverage = useCallback((role: Role) => {
    const coverage: Record<string, number> = {};
    
    Object.entries(permissionsByModule).forEach(([module, permissions]) => {
      const total = permissions.length;
      const assigned = role.permissions.filter((p) => p.module === module).length;
      coverage[module] = Math.round((assigned / total) * 100);
    });
    
    return coverage;
  }, [permissionsByModule]);

  const getUserEffectivePermissions = useCallback((user: User) => {
    return rbacManager.getUserPermissions(user);
  }, [rbacManager]);

  const checkPermissionConflicts = useCallback((role: Role) => {
    const conflicts: Array<{ permission: Permission; conflictingRoles: Role[] }> = [];
    
    role.permissions.forEach((permission) => {
      const conflictingRoles = allRoles.filter((r) =>
        r.id !== role.id &&
        r.permissions.some((p) =>
          p.module === permission.module &&
          p.actions.some((a) => permission.actions.includes(a))
        )
      );
      
      if (conflictingRoles.length > 0) {
        conflicts.push({ permission, conflictingRoles });
      }
    });
    
    return conflicts;
  }, [allRoles]);

  const analyzePermissionUsage = useCallback(() => {
    const usage = new Map<string, { roles: number; users: number }>();
    
    allPermissions.forEach((permission) => {
      const roles = allRoles.filter((r) =>
        r.permissions.some((p) => p.id === permission.id)
      ).length;
      
      const users = allUsers.filter((u) =>
        u.roles.some((r) =>
          r.permissions.some((p) => p.id === permission.id)
        )
      ).length;
      
      usage.set(permission.id, { roles, users });
    });
    
    return usage;
  }, [allPermissions, allRoles, allUsers]);

  return {
    moduleStats,
    permissionsByModule,
    selectedModule,
    setSelectedModule,
    getRolePermissionCoverage,
    getUserEffectivePermissions,
    checkPermissionConflicts,
    analyzePermissionUsage,
  };
}
