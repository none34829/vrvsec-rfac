import { User, Role, Permission, Module } from '../types';

export const modules: Module[] = [
  { id: '1', name: 'Dashboard', description: 'Main dashboard access' },
  { id: '2', name: 'Users', description: 'User management' },
  { id: '3', name: 'Roles', description: 'Role management' },
  { id: '4', name: 'Reports', description: 'Security reports and analytics' },
];

export const permissions: Permission[] = [
  {
    id: '1',
    name: 'Manage Users',
    description: 'Create, read, update, and delete users',
    module: 'Users',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: '2',
    name: 'View Dashboard',
    description: 'Access to dashboard analytics',
    module: 'Dashboard',
    actions: ['read'],
  },
  {
    id: '3',
    name: 'Manage Roles',
    description: 'Create, read, update, and delete roles',
    module: 'Roles',
    actions: ['create', 'read', 'update', 'delete'],
  },
];

export const roles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: permissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'User Manager',
    description: 'Can manage users',
    permissions: [permissions[0]],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    status: 'active',
    roles: [roles[0]], // Super Admin role
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    roles: [roles[1]], // User Manager role
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    roles: [roles[1]], // User Manager role
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
