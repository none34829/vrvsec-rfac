import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { User } from '@/types';
import { roles } from '@/lib/mockData';

interface UserDialogProps {
  user?: User;
  open: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
}

export function UserDialog({ user, open, onClose, onSave }: UserDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    email: user?.email || '',
    status: user?.status || 'active',
    roles: user?.roles || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as 'active' | 'inactive',
                }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Roles</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.roles?.some((r) => r.id === role.id)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        roles: e.target.checked
                          ? [...(prev.roles || []), role]
                          : prev.roles?.filter((r) => r.id !== role.id) || [],
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{role.name}</span>
                </label>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{user ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
