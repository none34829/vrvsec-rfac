'use client';

import { useState } from 'react';
import { Role, Permission } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { SearchBar } from '@/components/ui/SearchBar';
import { PermissionTree } from './PermissionTree';

interface RoleManagerProps {
  roles: Role[];
  permissions: Permission[];
  onUpdateRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onCreateRole: (role: Partial<Role>) => void;
}

export function RoleManager({
  roles,
  permissions,
  onUpdateRole,
  onDeleteRole,
  onCreateRole,
}: RoleManagerProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPermissionTree, setShowPermissionTree] = useState(false);

  const handlePermissionToggle = (role: Role, permission: Permission) => {
    const hasPermission = role.permissions.some((p) => p.id === permission.id);
    let updatedPermissions;

    if (hasPermission) {
      updatedPermissions = role.permissions.filter((p) => p.id !== permission.id);
    } else {
      updatedPermissions = [...role.permissions, permission];
    }

    onUpdateRole({
      ...role,
      permissions: updatedPermissions,
    });
  };

  const getPermissionsByModule = () => {
    const modules: Record<string, Permission[]> = {};
    permissions.forEach((permission) => {
      if (!modules[permission.module]) {
        modules[permission.module] = [];
      }
      modules[permission.module].push(permission);
    });
    return modules;
  };

  const handleCreateRole = () => {
    const newRole: Partial<Role> = {
      name: 'New Role',
      description: '',
      permissions: []
    };
    onCreateRole(newRole);
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search roles..."
          />
        </div>
        <Button onClick={() => setShowPermissionTree(!showPermissionTree)}>
          {showPermissionTree ? 'Hide Permission Tree' : 'Show Permission Tree'}
        </Button>
        <Button onClick={handleCreateRole}>Create Role</Button>
      </div>

      {showPermissionTree && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Permission Hierarchy</h3>
          <PermissionTree
            roles={roles}
            onPermissionClick={(permission) => {
              if (selectedRole) {
                handlePermissionToggle(selectedRole, permission);
              }
            }}
          />
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => (
          <Card key={role.id} className={`transition-shadow hover:shadow-md ${
            selectedRole?.id === role.id ? 'ring-2 ring-blue-500' : ''
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{role.name}</h3>
                <Dropdown
                  trigger={<Button variant="ghost" size="sm">•••</Button>}
                  items={[
                    {
                      label: 'Edit',
                      onClick: () => setSelectedRole(role),
                    },
                    {
                      label: 'Delete',
                      onClick: () => onDeleteRole(role.id),
                      variant: 'destructive',
                    },
                  ]}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">{role.description}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Permissions</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge
                      key={permission.id}
                      variant="info"
                      className="cursor-pointer"
                      onClick={() => handlePermissionToggle(role, permission)}
                      asButton
                    >
                      {permission.module}: {permission.actions.join(', ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Module Coverage</h4>
                <div className="mt-2">
                  {Object.entries(getPermissionsByModule()).map(([module, modulePermissions]) => {
                    const total = modulePermissions.length;
                    const assigned = role.permissions.filter((p) => p.module === module).length;
                    const percentage = Math.round((assigned / total) * 100);

                    return (
                      <div key={module} className="mb-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{module}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
