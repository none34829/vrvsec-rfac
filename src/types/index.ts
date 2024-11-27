export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
}