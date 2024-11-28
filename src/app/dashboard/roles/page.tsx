'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { RoleDialog } from '@/components/dialogs/RoleDialog';
import { Role } from '@/types';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/Toast';

export default function RolesPage() {
  const { roles, setRoles, addActivity } = useData();
  const { showToast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();

  const handleSave = (roleData: Partial<Role>) => {
    try {
      if (!roleData.name || !roleData.description) {
        throw new Error('Name and description are required');
      }

      if (!Array.isArray(roleData.permissions) || roleData.permissions.length === 0) {
        throw new Error('At least one permission must be selected');
      }

      if (selectedRole) {
        // Update existing role
        setRoles(prev =>
          prev.map((role) =>
            role.id === selectedRole.id
              ? { 
                  ...role, 
                  ...roleData, 
                  permissions: roleData.permissions || role.permissions,
                  updatedAt: new Date().toISOString() 
                }
              : role
          )
        );
        addActivity('role_modified', 'Role Updated', `Role "${roleData.name}" has been updated`);
      } else {
        // Create new role
        const newRole: Role = {
          id: Math.random().toString(36).substr(2, 9),
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setRoles(prev => [...prev, newRole]);
        addActivity('role_modified', 'Role Created', `New role "${roleData.name}" has been created`);
      }
      
      setSelectedRole(undefined);
      setDialogOpen(false);
      showToast(selectedRole ? 'Role updated successfully' : 'Role created successfully', 'success');
    } catch (error) {
      console.error('Failed to save role:', error);
      showToast(error instanceof Error ? error.message : 'Failed to save role', 'error');
    }
  };

  const handleDelete = (roleId: string) => {
    try {
      const roleToDelete = roles.find(role => role.id === roleId);
      if (!roleToDelete) {
        throw new Error('Role not found');
      }

      // Prevent deletion of system roles
      if (roleToDelete.name.toLowerCase() === 'super admin') {
        throw new Error('Cannot delete system roles');
      }

      setRoles(prev => prev.filter((role) => role.id !== roleId));
      addActivity('role_modified', 'Role Deleted', `Role "${roleToDelete.name}" has been deleted`);
      showToast('Role deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete role:', error);
      showToast(error instanceof Error ? error.message : 'Failed to delete role', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Roles</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage role definitions and permissions</p>
        </div>
        <Button
          onClick={() => {
            setSelectedRole(undefined);
            setDialogOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <h3 className="text-lg font-medium">{role.name}</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedRole(role);
                      setDialogOpen(true);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(role.id)}
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-900"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{role.description}</p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Permissions</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {permission.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Created {formatDate(role.createdAt)}</p>
                <p>Last updated {formatDate(role.updatedAt)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <RoleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedRole(undefined);
          }
        }}
        onSave={handleSave}
        role={selectedRole}
      />
    </div>
  );
}
