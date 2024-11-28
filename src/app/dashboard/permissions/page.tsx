'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PermissionDialog } from '@/components/dialogs/PermissionDialog';
import type { Permission } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/Toast';
import { modules } from '@/lib/mockData';

export default function PermissionsPage() {
  const { permissions, setPermissions: setPermissionsFunc, roles, addActivity } = useData();
  const { showToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('create');

  const handleSave = (permissionData: Partial<Permission>) => {
    try {
      // Validate required fields
      if (!permissionData.name || !permissionData.description || !permissionData.module) {
        throw new Error('All fields are required');
      }

      if (!Array.isArray(permissionData.actions) || permissionData.actions.length === 0) {
        throw new Error('At least one action must be selected');
      }

      if (selectedPermission) {
        // Update existing permission
        setPermissionsFunc((prev: Permission[]) =>
          prev.map((permission) =>
            permission.id === selectedPermission.id
              ? { 
                  ...permission,
                  ...permissionData,
                  actions: permissionData.actions || permission.actions,
                }
              : permission
          )
        );
        addActivity('permission_updated', 'Permission Updated', `Permission "${permissionData.name}" has been updated`);
      } else {
        // Create new permission
        const newPermission: Permission = {
          id: Math.random().toString(36).substr(2, 9),
          name: permissionData.name,
          description: permissionData.description,
          module: permissionData.module,
          actions: permissionData.actions,
        };
        setPermissionsFunc((prev: Permission[]) => [...prev, newPermission]);
        addActivity('permission_updated', 'Permission Created', `New permission "${permissionData.name}" has been created`);
      }
      
      setSelectedPermission(undefined);
      setDialogOpen(false);
      showToast(selectedPermission ? 'Permission updated successfully' : 'Permission created successfully', 'success');
    } catch (error) {
      console.error('Failed to save permission:', error);
      showToast(error instanceof Error ? error.message : 'Failed to save permission', 'error');
    }
  };

  const handleDelete = (permissionId: string) => {
    try {
      const permissionToDelete = permissions.find(p => p.id === permissionId);
      if (!permissionToDelete) {
        throw new Error('Permission not found');
      }

      // Check if this permission is used by any roles
      const isUsedInRoles = roles.some(role => 
        role.permissions.some(p => p.id === permissionId)
      );

      if (isUsedInRoles) {
        throw new Error('Cannot delete permission: It is currently used by one or more roles');
      }

      setPermissionsFunc((prev: Permission[]) => prev.filter((permission) => permission.id !== permissionId));
      addActivity('permission_updated', 'Permission Deleted', `Permission "${permissionToDelete.name}" has been deleted`);
      showToast('Permission deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete permission:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete permission', 'error');
    }
  };

  const permissionsByModule = modules.map((module) => ({
    ...module,
    permissions: permissions.filter((p) => p.module === module.name),
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Permissions</h1>
          <p className="text-sm sm:text-base text-gray-500">Configure system permissions by module</p>
        </div>
        <Button
          onClick={() => {
            setSelectedPermission(undefined);
            setDialogOpen(true);
            setDialogMode('create');
          }}
          className="w-full sm:w-auto"
        >
          Add Permission
        </Button>
      </div>

      <div className="grid gap-6">
        {permissionsByModule.map((module) => (
          <Card key={module.id}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{module.name}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPermission(undefined);
                    setDialogOpen(true);
                    setDialogMode('create');
                  }}
                  className="w-full sm:w-auto"
                >
                  Add Permission
                </Button>
              </div>

              <div className="mt-6 divide-y divide-gray-200">
                {module.permissions.map((permission) => (
                  <div key={permission.id} className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium">
                          {permission.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {permission.description}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {permission.actions.map((action) => (
                            <span
                              key={action}
                              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {action}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPermission(permission);
                              setDialogOpen(true);
                              setDialogMode('view');
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPermission(permission);
                              setDialogOpen(true);
                              setDialogMode('edit');
                            }}
                            className="flex-1 sm:flex-none"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(permission.id)}
                            className="flex-1 sm:flex-none text-red-600 hover:text-red-900"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <PermissionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedPermission(undefined);
          }
        }}
        onSave={handleSave}
        permission={selectedPermission}
        modules={modules}
        mode={dialogMode}
      />
    </div>
  );
}
