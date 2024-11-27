import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Role, Permission } from '@/types';
import { permissions } from '@/lib/mockData';

interface RoleDialogProps {
  role?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (role: Partial<Role>) => void;
}

export function RoleDialog({ role, open, onOpenChange, onSave }: RoleDialogProps) {
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
  });

  useEffect(() => {
    if (open && role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: [...role.permissions],
      });
    } else if (!open) {
      setFormData({
        name: '',
        description: '',
        permissions: [],
      });
    }
  }, [open, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create Role'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter role name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter role description"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Permissions</label>
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-4">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions?.some((p) => p.id === permission.id)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        permissions: e.target.checked
                          ? [...(prev.permissions || []), permission]
                          : prev.permissions?.filter((p) => p.id !== permission.id) || [],
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <div className="text-sm font-medium">{permission.name}</div>
                    <div className="text-xs text-gray-500">{permission.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{role ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
