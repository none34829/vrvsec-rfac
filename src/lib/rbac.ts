import { User, Role, Permission } from '@/types';

export interface PermissionCheck {
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'bulk_edit';
}

export class RBACManager {
  private static instance: RBACManager;

  private constructor() {}

  public static getInstance(): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager();
    }
    return RBACManager.instance;
  }

  public hasPermission(user: User, check: PermissionCheck): boolean {
    return user.roles.some((role) =>
      role.permissions.some(
        (permission) =>
          permission.module === check.module &&
          permission.actions.includes(check.action)
      )
    );
  }

  public hasAnyRole(user: User, roleNames: string[]): boolean {
    return user.roles.some((role) => roleNames.includes(role.name));
  }

  public hasAllRoles(user: User, roleNames: string[]): boolean {
    return roleNames.every((roleName) =>
      user.roles.some((role) => role.name === roleName)
    );
  }

  public getUserPermissions(user: User): Permission[] {
    const uniquePermissions = new Map<string, Permission>();
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        uniquePermissions.set(permission.id, permission);
      });
    });
    return Array.from(uniquePermissions.values());
  }

  public getPermissionHierarchy(roles: Role[]): Record<string, string[]> {
    const hierarchy: Record<string, string[]> = {};
    roles.forEach((role) => {
      hierarchy[role.name] = role.permissions.map((p) => p.name);
    });
    return hierarchy;
  }
}
