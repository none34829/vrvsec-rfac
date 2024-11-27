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
import { Permission, Module } from '@/types';

interface PermissionDialogProps {
  permission?: Permission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (permission: Partial<Permission>) => void;
  modules: Module[];
}

export function PermissionDialog({
  permission,
  open,
  onOpenChange,
  onSave,
  modules,
}: PermissionDialogProps) {
  const [formData, setFormData] = useState<Partial<Permission>>({
    name: '',
    description: '',
    module: modules[0].name,
    actions: [],
  });

  // Reset form when dialog opens/closes or permission changes
  useEffect(() => {
    if (open && permission) {
      setFormData({
        name: permission.name,
        description: permission.description,
        module: permission.module,
        actions: [...permission.actions],
      });
    } else if (!open) {
      setFormData({
        name: '',
        description: '',
        module: modules[0].name,
        actions: [],
      });
    }
  }, [open, permission, modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name?.trim()) {
      alert('Permission name is required');
      return;
    }
    if (!formData.description?.trim()) {
      alert('Permission description is required');
      return;
    }
    if (!formData.actions || formData.actions.length === 0) {
      alert('At least one action must be selected');
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      module: modules[0].name,
      actions: [],
    });
    onOpenChange(false);
  };

  const availableActions = ['create', 'read', 'update', 'delete'] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {permission ? 'Edit Permission' : 'Create Permission'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter permission name"
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
              placeholder="Enter permission description"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Module</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.module}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, module: e.target.value }))
              }
              required
            >
              {modules.map((module) => (
                <option key={module.id} value={module.name}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Actions</label>
            <div className="space-y-2">
              {availableActions.map((action) => (
                <label key={action} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.actions?.includes(action)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        actions: e.target.checked
                          ? [...(prev.actions || []), action]
                          : prev.actions?.filter((a) => a !== action) || [],
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{action}</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{permission ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
