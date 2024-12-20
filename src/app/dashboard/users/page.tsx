'use client';

import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { UserDialog } from '@/components/dialogs/UserDialog';
import { ViewPermissionsDialog } from '@/components/dialogs/ViewPermissionsDialog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { User, Role, Permission } from '@/types';
import { useData } from '@/contexts/DataContext';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { useRBAC } from '@/hooks/useRBAC';
import { useToast } from '@/components/ui/Toast';
import { RBACManager } from '@/lib/rbac';
import { formatDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<Permission[]>([]);
  const { users: usersList, setUsers: setUsersList, addActivity, roles } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { checkPermission } = useRBAC();
  const rbacManager = RBACManager.getInstance();
  const { showToast } = useToast();

  const canEditUsers = checkPermission({ module: 'Users', action: 'update' });
  const canDeleteUsers = checkPermission({ module: 'Users', action: 'delete' });
  const canBulkEdit = checkPermission({ module: 'Users', action: 'bulk_edit' });

  const handleError = useCallback((error: Error) => {
    console.error('Operation failed:', error);
    showToast(error.message, 'error');
  }, [showToast]);

  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    try {
      if (action === 'delete' && !canDeleteUsers) {
        throw new Error('Permission denied: Cannot delete users');
      }
      if ((action === 'activate' || action === 'deactivate') && !canEditUsers) {
        throw new Error('Permission denied: Cannot modify users');
      }

      const updatedUsers = usersList.map(user => {
        if (selectedUsers.includes(user.id)) {
          return {
            ...user,
            status: action === 'activate' ? 'active' : action === 'deactivate' ? 'inactive' : user.status
          };
        }
        return user;
      });

      setUsersList(updatedUsers);
      if (action === 'delete') {
        addActivity('users_deleted', 'Users Deleted', `Deleted ${selectedUsers.length} users`);
      } else {
        addActivity('users_status_updated', 'Users Status Updated', `${action === 'activate' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} users`);
      }
      setSelectedUsers([]);
      showToast('Bulk action completed successfully', 'success');
    } catch (error) {
      handleError(error as Error);
    }
  }, [selectedUsers, canDeleteUsers, canEditUsers, setUsersList, addActivity, handleError, showToast, usersList]);

  const handleSave = useCallback(async (userData: Partial<User>) => {
    try {
      if (!canEditUsers) {
        throw new Error('Permission denied: Cannot modify users');
      }

      const now = new Date().toISOString();
      const existingUser = selectedUser ? usersList.find(u => u.id === selectedUser.id) : null;

      // Ensure all required fields are present
      if (!userData.name || !userData.email) {
        throw new Error('Name and email are required');
      }

      const updatedUser: User = existingUser
        ? {
            ...existingUser,
            ...userData,
            updatedAt: now
          }
        : {
            id: Math.random().toString(36).substr(2, 9),
            name: userData.name,
            email: userData.email,
            status: 'active',
            roles: userData.roles || [],
            createdAt: now,
            updatedAt: now
          };

      const updatedUsers = existingUser
        ? usersList.map(u => (u.id === existingUser.id ? updatedUser : u))
        : [...usersList, updatedUser];

      setUsersList(updatedUsers);
      if (existingUser) {
        addActivity(
          'role_modified',
          'User Updated',
          `${updatedUser.name} has been updated`
        );
      } else {
        addActivity(
          'user_added',
          'User Created',
          `${updatedUser.name} has been created`
        );
      }
      setDialogOpen(false);
      showToast(`User ${selectedUser ? 'updated' : 'created'} successfully`, 'success');
    } catch (error) {
      handleError(error as Error);
    }
  }, [selectedUser, canEditUsers, setUsersList, addActivity, handleError, showToast, usersList]);

  const handleDelete = useCallback(async (userId: string) => {
    try {
      if (!canDeleteUsers) {
        throw new Error('Permission denied: Cannot delete users');
      }

      const userToDelete = usersList.find(u => u.id === userId);
      if (!userToDelete) {
        throw new Error('User not found');
      }

      const updatedUsers = usersList.filter(u => u.id !== userId);
      setUsersList(updatedUsers);
      addActivity('user_deleted', 'User deleted', `${userToDelete.name} has been removed from the system`);
      showToast('User deleted successfully', 'success');
    } catch (error) {
      handleError(error as Error);
    }
  }, [canDeleteUsers, usersList, setUsersList, addActivity, handleError, showToast]);

  const filteredUsers = useMemo(() => {
    return usersList
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const direction = sortDirection === 'asc' ? 1 : -1;
        return aValue < bValue ? -direction : direction;
      });
  }, [usersList, searchQuery, statusFilter, sortField, sortDirection]);

  const sortOptions = [
    { label: 'Name', onClick: () => setSortField('name') },
    { label: 'Email', onClick: () => setSortField('email') },
    { label: 'Status', onClick: () => setSortField('status') },
    { label: 'Created Date', onClick: () => setSortField('createdAt') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-500">Manage user access and roles</p>
        </div>
        <div className="flex items-center gap-2">
          {canBulkEdit && (
            <Button
              variant="outline"
              onClick={() => setBulkSelectMode(!bulkSelectMode)}
              className="mr-2"
            >
              {bulkSelectMode ? 'Cancel Bulk Edit' : 'Bulk Edit'}
            </Button>
          )}
          {canEditUsers && (
            <Button
              onClick={() => {
                setSelectedUser(undefined);
                setDialogOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add User
            </Button>
          )}
        </div>
      </div>

      {bulkSelectMode && selectedUsers.length > 0 && (
        <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
          <span className="text-sm text-gray-600">{selectedUsers.length} users selected</span>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('activate')}
            className="text-green-600"
          >
            Activate
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('deactivate')}
            className="text-yellow-600"
          >
            Deactivate
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBulkAction('delete')}
            className="text-red-600"
          >
            Delete
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search users by name or email..."
          />
        </div>
        <Dropdown
          trigger={
            <Button variant="outline">
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </Button>
          }
          items={[
            { label: 'All', onClick: () => setStatusFilter('all') },
            { label: 'Active', onClick: () => setStatusFilter('active') },
            { label: 'Inactive', onClick: () => setStatusFilter('inactive') },
          ]}
        />
        <Dropdown
          trigger={<Button variant="outline">Sort By</Button>}
          items={sortOptions}
        />
        <Button
          variant="outline"
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                {bulkSelectMode && (
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {bulkSelectMode && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} />
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge
                      variant={user.status === 'active' ? 'success' : 'error'}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role.id} variant="info">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Dropdown
                      align="right"
                      trigger={
                        <Button variant="ghost" size="sm">
                          •••
                        </Button>
                      }
                      items={[
                        ...(canEditUsers ? [{
                          label: 'Edit',
                          onClick: () => {
                            setSelectedUser(user);
                            setDialogOpen(true);
                          },
                        }] : []),
                        ...(canDeleteUsers ? [{
                          label: 'Delete',
                          onClick: () => {
                            // Wrap the async function to match () => void
                            handleDelete(user.id);
                          },
                          variant: 'destructive' as const, // Use type assertion
                        }] : []),
                        {
                          label: 'View Permissions',
                          onClick: () => {
                            const permissions = rbacManager.getUserPermissions(user);
                            setSelectedUserPermissions(permissions);
                            setPermissionsDialogOpen(true);
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dialogOpen && (
        <UserDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setSelectedUser(undefined);
            }
          }}
          onSave={handleSave}
          user={selectedUser}
          availableRoles={roles}
          rbacManager={rbacManager}
        />
      )}
      {permissionsDialogOpen && (
        <ViewPermissionsDialog
          open={permissionsDialogOpen}
          onOpenChange={(open) => {
            setPermissionsDialogOpen(open);
          }}
          permissions={selectedUserPermissions}
        />
      )}
    </div>
  );
}
