'use client';

import { useState } from 'react';
import { Role, Permission } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface PermissionTreeProps {
  roles: Role[];
  onPermissionClick?: (permission: Permission) => void;
}

export function PermissionTree({ roles, onPermissionClick }: PermissionTreeProps) {
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());

  const toggleRole = (roleId: string) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'read':
        return 'info';
      case 'update':
        return 'warning';
      case 'delete':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <Card key={role.id} className="overflow-hidden">
          <div
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => toggleRole(role.id)}
          >
            <div>
              <h3 className="font-medium">{role.name}</h3>
              <p className="text-sm text-gray-500">{role.description}</p>
            </div>
            <svg
              className={`h-5 w-5 transform text-gray-500 transition-transform ${
                expandedRoles.has(role.id) ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {expandedRoles.has(role.id) && (
            <div className="border-t bg-gray-50 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                {role.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow"
                    onClick={() => onPermissionClick?.(permission)}
                  >
                    <h4 className="font-medium">{permission.module}</h4>
                    <p className="mb-2 text-sm text-gray-500">{permission.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {permission.actions.map((action) => (
                        <Badge key={action} variant={getActionColor(action)}>
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
