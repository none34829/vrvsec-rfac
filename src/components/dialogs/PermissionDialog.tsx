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
  mode?: 'view' | 'edit' | 'create';
}

export function PermissionDialog({
  permission,
  open,
  onOpenChange,
  onSave,
  modules,
  mode = 'create',
}: PermissionDialogProps) {
  const [formData, setFormData] = useState<Partial<Permission>>({
    name: '',
    description: '',
    module: modules[0].name,
    actions: [],
  });

  const isViewMode = mode === 'view';

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
            {isViewMode ? 'View Permission' : permission ? 'Edit Permission' : 'Create Permission'}
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
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Module</label>
            <select
              value={formData.module}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, module: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              disabled={isViewMode}
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
            <div className="flex flex-wrap gap-2">
              {availableActions.map((action) => (
                <Button
                  key={action}
                  type="button"
                  variant={formData.actions?.includes(action) ? 'default' : 'outline'}
                  onClick={() =>
                    !isViewMode && setFormData((prev) => ({
                      ...prev,
                      actions: prev.actions?.includes(action)
                        ? prev.actions.filter((a) => a !== action)
                        : [...(prev.actions || []), action],
                    }))
                  }
                  className={isViewMode ? 'cursor-default' : ''}
                  disabled={isViewMode}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            {!isViewMode ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </>
            ) : (
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
