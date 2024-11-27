'use client';

import { useState } from 'react';
import { permissions, modules, roles } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PermissionDialog } from '@/components/dialogs/PermissionDialog';
import { Permission } from '@/types';

export default function PermissionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
  const [permissionsList, setPermissionsList] = useState(permissions);

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
        setPermissionsList((prev) =>
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
      } else {
        // Create new permission
        const newPermission: Permission = {
          id: Math.random().toString(36).substr(2, 9),
          name: permissionData.name,
          description: permissionData.description,
          module: permissionData.module,
          actions: permissionData.actions,
        };
        setPermissionsList((prev) => [...prev, newPermission]);
      }
      
      setSelectedPermission(undefined);
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save permission:', error);
      alert(error instanceof Error ? error.message : 'Failed to save permission');
    }
  };

  const handleDelete = (permissionId: string) => {
    try {
      const permissionToDelete = permissionsList.find(p => p.id === permissionId);
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

      setPermissionsList((prev) =>
        prev.filter((permission) => permission.id !== permissionId)
      );
    } catch (error) {
      console.error('Failed to delete permission:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete permission');
    }
  };

  const permissionsByModule = modules.map((module) => ({
    ...module,
    permissions: permissionsList.filter((p) => p.module === module.name),
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
        onClose={() => {
          setDialogOpen(false);
          setSelectedPermission(undefined);
        }}
        onSave={handleSave}
        permission={selectedPermission}
        modules={modules}
      />
    </div>
  );
}
