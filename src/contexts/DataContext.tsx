'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { users as initialUsers, roles as initialRoles, permissions as initialPermissions } from '@/lib/mockData';
import { activities as initialActivities } from '@/lib/activity';
import { User, Role, Permission } from '@/types';
import { Activity } from '@/lib/activity';

interface DataContextType {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  activities: Activity[];
  currentUser: User | null;
  setUsers: (users: User[] | ((prevUsers: User[]) => User[])) => void;
  setRoles: (roles: Role[] | ((prevRoles: Role[]) => Role[])) => void;
  setPermissions: (permissions: Permission[] | ((prevPermissions: Permission[]) => Permission[])) => void;
  addActivity: (type: Activity['type'], title: string, description: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsersState] = useState(initialUsers);
  const [roles, setRolesState] = useState(initialRoles);
  const [permissions, setPermissionsState] = useState(initialPermissions);
  const [activities, setActivities] = useState(initialActivities);
  const [currentUser] = useState<User>(initialUsers[0]); // Set the first user as current user (Super Admin)

  const setUsers = (usersOrUpdater: User[] | ((prevUsers: User[]) => User[])) => {
    if (typeof usersOrUpdater === 'function') {
      setUsersState(usersOrUpdater);
    } else {
      setUsersState(usersOrUpdater);
    }
  };

  const setRoles = (rolesOrUpdater: Role[] | ((prevRoles: Role[]) => Role[])) => {
    if (typeof rolesOrUpdater === 'function') {
      setRolesState(rolesOrUpdater);
    } else {
      setRolesState(rolesOrUpdater);
    }
  };

  const setPermissions = (permissionsOrUpdater: Permission[] | ((prevPermissions: Permission[]) => Permission[])) => {
    if (typeof permissionsOrUpdater === 'function') {
      setPermissionsState(permissionsOrUpdater);
    } else {
      setPermissionsState(permissionsOrUpdater);
    }
  };

  const addActivity = (type: Activity['type'], title: string, description: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep only last 10 activities
  };

  return (
    <DataContext.Provider value={{
      users,
      roles,
      permissions,
      activities,
      currentUser,
      setUsers,
      setRoles,
      setPermissions,
      addActivity,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
