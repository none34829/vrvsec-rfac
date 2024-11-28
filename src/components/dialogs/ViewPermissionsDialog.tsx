'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { Permission } from '@/types';

interface ViewPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
}

export function ViewPermissionsDialog({
  open,
  onOpenChange,
  permissions,
}: ViewPermissionsDialogProps) {
  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Permissions</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
            <div key={module} className="space-y-2">
              <h3 className="text-lg font-medium">{module}</h3>
              <div className="space-y-3">
                {modulePermissions.map((permission) => (
                  <div key={permission.id} className="rounded-lg border bg-gray-50 p-3">
                    <div className="flex flex-col gap-2">
                      <div>
                        <h4 className="font-medium">{permission.name}</h4>
                        <p className="text-sm text-gray-600">{permission.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {permission.actions.map((action) => (
                          <Badge
                            key={action}
                            variant={
                              action === 'create'
                                ? 'success'
                                : action === 'read'
                                ? 'info'
                                : action === 'update'
                                ? 'warning'
                                : 'error'
                            }
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
